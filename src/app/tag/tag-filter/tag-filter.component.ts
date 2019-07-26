import { Component, OnInit, Injectable, HostListener, ElementRef, Output, EventEmitter, Input, OnChanges, SimpleChanges, SimpleChange, AfterViewInit } from '@angular/core';

import {SelectionModel} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject, Subject} from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TagService } from '../tag.service';
import { TagInfo } from '../tag-type/tag-type.model';
import { Tag } from '../tag.model';

/**
 * Node for to-do item
 */
export class ItemNode {
  id: number;
  item: string;
  parent: ItemNode;
  children: ItemNode[];
}

/** Flat to-do item node with expandable and level information */
export class ItemFlatNode {
  id: number;
  item: string;
  level: number;
  expandable: boolean;
  visible: boolean;
}

/**
 * The Json object for to-do list data.
 */
const TREE_DATA = {
  Groceries: {
    'Almond Meal flour': null,
    'Organic eggs': null,
    'Protein Powder': null,
    Fruits: {
      Apple: null,
      Berries: ['Blueberry', 'Raspberry'],
      Orange: null
    }
  },
  Reminders: [
    'Cook dinner',
    'Read the Material Design spec',
    'Upgrade Application to Angular'
  ]
};

/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable()
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<ItemNode[]>([]);

  treeData: ItemNode[];

  get data(): ItemNode[] { return this.dataChange.value; }

  constructor(private tagService: TagService) {
    this.initialize();
  }

  initialize() {
    // Build the tree nodes from Json object. The result is a list of `ItemNode` with nested
    //     file node as children.

    const data = this.buildFileTree([], 0, null);
    this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `ItemNode`.
   */
  buildFileTree(obj: TagInfo[], level: number, parent: ItemNode): ItemNode[] {
    return Object.keys(obj).reduce<ItemNode[]>((accumulator, key) => {
      const tagInfo: TagInfo = obj[key];
      const tags: Tag[] = tagInfo.tags;
      if (tags) {
        for (let idx = 0; idx < tags.length; idx++) {
          const tag = tags[idx];
          const node: ItemNode = this.buildItemNode(accumulator, tag, parent);
          accumulator = accumulator.concat(node);
        }
      }
      return accumulator;
    }, []);
  }

  buildItemNode(accumulator: ItemNode[], tag: Tag, parent: ItemNode): ItemNode {
    let node: ItemNode = new ItemNode();
    node.id = tag.id;
    node.item = tag.displayName;
    node.parent = parent;
    if (tag.children) {
      node.children = new Array<ItemNode>();
      for (let idx = 0; idx < tag.children.length; idx++) {
        const child = tag.children[idx];
        const childNode = this.buildItemNode(accumulator, child, node);
        node.children.push(childNode);
        accumulator = accumulator.concat(childNode);
      }
    } else {
      node.children = null;
    }
    return node;
  }

  /** Add an item to to-do list */
  insertItem(parent: ItemNode, name: string) {
    if (parent.children) {
      parent.children.push({item: name} as ItemNode);
      this.dataChange.next(this.data);
    }
  }

  updateItem(node: ItemNode, name: string) {
    node.item = name;
    this.dataChange.next(this.data);
  }
}

@Component({
  selector: 'app-tag-filter',
  templateUrl: './tag-filter.component.html',
  styleUrls: ['./tag-filter.component.scss'],
  providers: [ChecklistDatabase]
})
export class TagFilterComponent implements OnInit, OnChanges, AfterViewInit {

  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<ItemFlatNode, ItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<ItemNode, ItemFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: ItemFlatNode | null = null;

  /** The new item's name */
  newItemName = '';

  treeControl: FlatTreeControl<ItemFlatNode>;

  treeFlattener: MatTreeFlattener<ItemNode, ItemFlatNode>;

  dataSource: MatTreeFlatDataSource<ItemNode, ItemFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<ItemFlatNode>(true /* multiple */);

  showDropDown = false;

  selectedTagIds: Set<number> = new Set<number>();
  selectedTags: ItemFlatNode[];

  @Output()
  selectedTagsChange = new EventEmitter<Set<number>>();

  @Input()
  selectedTagNumbers: any[];

  @Input()
  treeData: TagInfo[];

  @Input()
  placeHolder: string;

  constructor(private database: ChecklistDatabase, private _elementRef: ElementRef) {
  }

  ngOnInit() {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<ItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    this.database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });
  }

  ngAfterViewInit() {
    const data = this.treeControl.dataNodes;
    let isTagPresent = false;
    if (this.selectedTagNumbers) {
      for (let idx = 0; idx < data.length; idx++) {
        const element = data[idx];
        for (let idx2 = 0; idx2 < this.selectedTagNumbers.length; idx2++) {
          const element2 = this.selectedTagNumbers[idx2];
          if (element.id === parseInt(element2)) {
            isTagPresent = true;
            this.todoItemSelectionToggle(element, false);
          }
        }
      }
      if (isTagPresent) {
        this.selectedTagsChange.emit(this.selectedTagIds);
      }
      this.showTreeDropDown(false);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const treeData: SimpleChange = changes.treeData;
    if (treeData) {
      this.treeData = treeData.currentValue;
      this.database.treeData = this.database.buildFileTree(this.treeData, 0, null);
      this.database.dataChange.next(this.database.treeData);
    }
  }

  getLevel = (node: ItemFlatNode) => node.level;

  isExpandable = (node: ItemFlatNode) => node.expandable;

  getChildren = (node: ItemNode): ItemNode[] => node.children;

  hasChild = (_: number, _nodeData: ItemFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: ItemFlatNode) => _nodeData.item === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: ItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = this.buildFlatNode(existingNode, node, level);
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  private buildFlatNode(existingNode: ItemFlatNode, node: ItemNode, level: number) {
    const flatNode = existingNode && existingNode.item === node.item
      ? existingNode
      : new ItemFlatNode();
    flatNode.id = node.id;
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    flatNode.visible = true;
    return flatNode;
  }

  /** Whether all the descendants of the node are selected */
  descendantsAllSelected(node: ItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.every(child => this.checklistSelection.isSelected(child));
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: ItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: ItemFlatNode, emitChange = true): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);
    const selectedFlatNodes: ItemFlatNode[] = this.checklistSelection.selected;
    this.selectedTagIds = new Set<number>();
    this.selectedTags = new Array<ItemFlatNode>();
    if (selectedFlatNodes) {
      for (let idx = 0; idx < selectedFlatNodes.length; idx++) {
        const flatNode = selectedFlatNodes[idx];
        this.selectedTagIds.add(flatNode.id);
        this.selectedTags.push(flatNode);
      }
    }
    if (emitChange) {
      this.selectedTagsChange.emit(this.selectedTagIds);
    }
    this.showTreeDropDown(!this.showDropDown);
  }

  /** Select the category so we can insert the new item. */
  addNewItem(node: ItemFlatNode) {
    const parentNode = this.flatNodeMap.get(node);
    this.database.insertItem(parentNode!, '');
    this.treeControl.expand(node);
  }

  /** Save the node to database */
  saveNode(node: ItemFlatNode, itemValue: string) {
    const nestedNode = this.flatNodeMap.get(node);
    this.database.updateItem(nestedNode!, itemValue);
  }

  searchFilter: Subject<string> = new Subject<string>();

  filterChanged(filter: string): void {
    // this.searchFilter.pipe(debounceTime(500), distinctUntilChanged())
    // .subscribe(value => {
      if (filter && filter.length >= 1) {
        this.filterByName(filter);
      } else {
        this.clearFilter();
      }
    // });
  }
  
  public showTreeDropDown(showDropDown: boolean): void {
    this.showDropDown = showDropDown;
  }

  @HostListener('document:click', ['$event.target']) onMouseEnter(targetElement) {
    const clickedInside = this._elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.showTreeDropDown(false);
    }
  }

  private filterByName(term: string): void {
    const filteredItems = this.treeControl.dataNodes.filter(
      x => x.item.toLowerCase().indexOf(term.toLowerCase()) === -1
    );
    filteredItems.map(x => {
      x.visible = false;
    });
  
    const visibleItems = this.treeControl.dataNodes.filter(
      x => x.item &&
      x.item.toLowerCase().indexOf(term.toLowerCase()) > -1
    );
    visibleItems.map( x => {
      x.visible = true;
      this.markParent(x);
      this.markChildren(x);
    });
  }

  markParent(flatNode: ItemFlatNode): any {
    let node: ItemNode = this.flatNodeMap.get(flatNode);
    if (node.parent) {
      let parentFlatNode: ItemFlatNode = this.nestedNodeMap.get(node.parent);
      parentFlatNode.visible = true;
      this.markParent(parentFlatNode);
    }
  }

  markChildren(flatNode: ItemFlatNode): any {
    let node: ItemNode = this.flatNodeMap.get(flatNode);
    if (node.children && node.children.length > 0) {
      for(let idx in node.children) {
        let child = node.children[idx];
        let childFlatNode = this.nestedNodeMap.get(child);
        childFlatNode.visible = true;
        this.markChildren(childFlatNode);
      }
    }
  }

  removeAllTag(event: Event) {
    (this.selectedTags || []).forEach((x, i, arr) => this.todoItemSelectionToggle(x, i === arr.length - 1));
    this.showTreeDropDown(false);
    event.stopPropagation();
  }

  private clearFilter(): void {
    this.treeControl.dataNodes.forEach(x => x.visible = true);
  }
}
