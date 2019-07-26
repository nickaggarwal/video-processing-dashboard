import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TableData } from './data-table.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent<T> implements OnInit {

  @Input()
  dataTableTitle: string;

  @Input()
  tableData: TableData<T>;

  _addNewRow = false;
  @Input() set addNewRow(addNewRow) {
    this._addNewRow = addNewRow;
    this.addNewRowChange.emit(addNewRow);
  };

  get addNewRow() {
    return this._addNewRow;
  }

  @Output() addNewRowChange = new EventEmitter<boolean>();

  @Output()
  rowAdded = new EventEmitter<any>();

  @Output()
  rowEdited = new EventEmitter<any>();

  @Output()
  rowDeleted = new EventEmitter<any>();

  @Output()
  duplicateError = new EventEmitter<any>();

  constructor() { }
  ngOnInit() {
  }

  public deleteRow(rowIdx) {
    this.rowDeleted.emit(rowIdx);
  }

  onAddNewRow(form: NgForm) {
    const value = form.value;
    if (this.tableData.dataRows.find(x => x['email'].trim().toLowerCase() === value.email.trim().toLowerCase())) {
      this.duplicateError.next();
      return;
    }
    this.tableData.dataRows.push(form.value);
    this.addNewRow = false;
  }

  saveRow(form, index) {
    this.tableData.dataRows[index] = { ...form.value };
  }
}
