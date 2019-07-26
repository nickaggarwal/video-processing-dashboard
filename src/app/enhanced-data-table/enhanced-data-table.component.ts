import { Component, OnInit, Input, AfterViewInit, OnChanges, SimpleChange, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { TableData, Action } from './enhanced-data-table.model';
import { Subject } from 'rxjs';

declare const $: any;

@Component({
  selector: 'app-enhanced-data-table',
  templateUrl: './enhanced-data-table.component.html',
  styleUrls: ['./enhanced-data-table.component.scss']
})
export class EnhancedDataTableComponent<T> implements OnInit {

  @Input()
  isSample: boolean;

  @Input()
  headerCardIcon: string;

  @Input()
  sampleHeaderCardIcon: string;

  @Input()
  dataTableTitle: string;

  @Input()
  totalRecords: string;

  @Input()
  tableData: TableData<T>;

  @Input()
  actions: Action[];

  @Output()
  onScrollEvent = new EventEmitter();

  @Output()
  viewEvent = new EventEmitter<T>();

  constructor() { }

  ngOnInit() {
  }

  public view(t: T) {
    this.viewEvent.next(t);
  }

  public onScroll() {
    this.onScrollEvent.next();
  }
}
