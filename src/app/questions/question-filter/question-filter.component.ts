import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { TagInfo } from 'app/tag/tag-type/tag-type.model';
import { TagService } from 'app/tag/tag.service';
import { Tag } from 'app/tag/tag.model';

@Component({
  selector: 'app-question-filter',
  templateUrl: './question-filter.component.html',
  styleUrls: ['./question-filter.component.scss']
})
export class QuestionFilterComponent implements OnInit {

  @Input()
  selectedTagIds: number[];

  @Output()
  selectedTagsChange = new EventEmitter<Set<number>>();

  public tags: Set<number> = new Set();
  public treeData: TagInfo[] = [];
  public preselectedTagIds: number[];
  public specialTagTypes = [{
    name: 'JOB_ROLE_TYPE',
    placeHolder: 'Select Job Role...',
    isOther: false
  }, {
    name: 'INDUSTRY_TYPE',
    placeHolder: 'Select Industry...',
    isOther: false
  }, {
    name: 'DIFFICULTY_LEVEL',
    placeHolder: 'Select DIfficulty Level...',
    isOther: false
  }, {
    name: '',
    placeHolder: 'Select other tags...',
    isOther: true
  }];
  public specialTagTypeInfos = [];

  constructor(private tagService: TagService) { }

  ngOnInit() {
    this.tagService.getAllTags().subscribe(
      data => {
        this.treeData = data['response'];
        for (let idx = 0; idx < this.specialTagTypes.length; idx++) {
          const specialTagType = this.specialTagTypes[idx];
          const treeData = specialTagType.isOther ?
                              this.getOtherTreeData(this.treeData) :
                              this.getTagTypeTreeData(this.treeData, specialTagType.name);
          this.specialTagTypeInfos.push({
            id: idx,
            selectedTagIds: this.selectedTagIds,
            treeData: treeData,
            placeHolder: specialTagType.placeHolder
          });
        }
      }
    );
    this.preselectedTagIds = this.selectedTagIds;
  }

  public selectedTagsChangeEmit(selectedTagIds: Set<number>, index: number) {
    this.init();
    const specialTagTypeInfo = this.specialTagTypeInfos[index];
    specialTagTypeInfo.selectedTagIds = selectedTagIds;

    for (let idx = 0; idx < this.specialTagTypeInfos.length; idx++) {
      const selectedTagIdsTemp = this.specialTagTypeInfos[idx].selectedTagIds;
      if (selectedTagIdsTemp && selectedTagIdsTemp.size > 0) {
        selectedTagIdsTemp.forEach(item => {
          this.tags.add(item);
        });
      }
    }
    if (this.preselectedTagIds && this.preselectedTagIds.length > 0) {
      if (this.preselectedTagIds.length === this.tags.size) {
        this.preselectedTagIds = undefined;
        this.selectedTagsChange.emit(this.tags);
      }
    } else {
      this.selectedTagsChange.emit(this.tags);
    }
  }

  private getOtherTreeData(treeData: TagInfo[]) {
    const otherTreeData: TagInfo[] = [];
    for (let idx = 0; idx < treeData.length; idx++) {
      const data = treeData[idx];
      let nameFound = false;
      for (let idx2 = 0; idx2 < this.specialTagTypes.length; idx2++) {
        const specialTagType = this.specialTagTypes[idx2];
        if (specialTagType.name === data.tagType.name) {
          nameFound = true;
          break;
        }
      }
      if (!nameFound) {
        otherTreeData.push(data);
      }
    }
    return otherTreeData;
  }

  private getTagTypeTreeData(tagInfos: TagInfo[], tagTypeName: string) {
    for (let idx = 0; idx < tagInfos.length; idx++) {
      const tagInfo = tagInfos[idx];
      if (tagInfo.tagType.name === tagTypeName) {
        const tags = tagInfo.tags;
        let finalTags: Tag[] = [];
        if (tags.length === 1) {
          finalTags = tags[0].children;
          const tagInfoNew: TagInfo = {
            tagType: tagInfo.tagType,
            tags: finalTags
          };
          return [tagInfoNew];
        }
      }
    }
    return [];
  }

  private init() {
    this.tags = new Set<number>();
  }

}
