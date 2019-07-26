import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { EnterpriseTypeService } from '../service/enterprise-type.service';
import { MatSelectChange } from '@angular/material';
import { EnterpriseType } from 'app/enterprise/enterprise-type/common/enterprise-type.model';


@Component({
  selector: 'app-enterprise-type-single-select',
  templateUrl: './single-select.component.html',
  styleUrls: ['./single-select.component.scss']
})
export class EnterpriseTypeSingleSelectComponent implements OnInit {
  entTypes: EnterpriseType[];

  @Input()
  entType: EnterpriseType;

  @Input()
  isDisabled: Boolean = false;

  @Output()
  selectionChange = new EventEmitter<EnterpriseType>();

  constructor(private entTypeService: EnterpriseTypeService) { }

  ngOnInit() {
    this.entTypeService.getAll().subscribe(data => {
      this.entTypes = data['response'];
      this.entType = this.entTypes[0];
      this.sendChangedData({value: this.entType});
    });
  }

  public sendChangedData($event) {
    this.selectionChange.emit($event.value);
  }
}
