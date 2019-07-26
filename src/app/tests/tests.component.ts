import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TestsService } from './tests.service'
import { CandidatesService } from '../candidates/candidates.service'
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Test } from './test.model';
import { TableData, Action } from 'app/enhanced-data-table/enhanced-data-table.model';
import { environment } from 'environments/environment';

declare const $: any;

@Component({
  selector: 'app-test',
  templateUrl: './tests.component.html'
})

export class TestsComponent implements OnInit, AfterViewInit {
  private LIMIT = 15;
  private OFFSET = 0;
  private TOTAL_RECORDS = 0;
  private limit: number;
  private offset: number;
  private totalRecords: number;
  public tests: Array<any>;
  public totalRecordsStr: string;
  public tableData: any;
  public actions: Action[];
  public isSampleFlag = false;
  private fetchingData = false;

  constructor(private route: ActivatedRoute, private _testService: TestsService, private router: Router ) {
    this.init();
    this.router.events.subscribe((_: NavigationEnd) => {
      if (_.url) {
        this._testService.setIsSampleFlag(_.url);
        this.isSampleFlag = this._testService.getIsSampleFlag();
      }
    });
  }

  public getPath(test) {
    if (this._testService.getIsSampleFlag()) {
      return '/reports/sample/detail/' + test.id;
    } else {
      return '/reports/detail/' + test.id;
    }
  }

  public updateData(data) {
    this.tests = this.tests.concat(data);
    this.tableData.dataRows = this.tests;
  }

  public viewReport(test) {
    this.router.navigate([this.getPath(test)]);
  }

  public onScroll() {
    if (!this._testService.getIsSampleFlag()) {
      this.getTests();
    }
  }

  public alertFn(error){
    console.log(error);
    alert('Error getting Data');
  }

  public ngOnInit() {
    this.init()
    this.getTests();
    this.actions = [{
      name: 'View Report',
      component: {
        'icon': 'assignment',
        'onClickFn': 'viewReport'
      }
    }];
  }

  private getTests() {
    if (this._testService.getIsSampleFlag()) {
      this._testService.getAllSampleTests().subscribe(data => {
        const tests: Test[] = data['results'];
        this.updateTotalRecords(tests.length);
        this.transformAndUpdateTests(tests);
      })
    } else {
      if (!this.fetchingData && (this.totalRecords === this.TOTAL_RECORDS || this.totalRecords > this.offset)) {
        this.fetchingData = true;
        this._testService.getAllTests(this.offset, this.limit).subscribe(
          data => {
            const tests: Test[] = data['results'];
            this.updateTotalRecords(data['count']);
            this.transformAndUpdateTests(tests);
            this.postFetching();
          },
          err => {
            this.postFetching();
          }
        );
        this.offset += this.limit;
      }
    }
  }

  private postFetching() {
    this.fetchingData = false;
  }

  private updateTotalRecords(totalRecords) {
    this.totalRecords = totalRecords;
    this.totalRecordsStr = 'Total Tests: ' + this.totalRecords;
  }

  private transformAndUpdateTests(tests: Test[]) {
    if (tests.length > 0) {
      for (let idx = 0; idx < tests.length; idx++) {
        let test: Test = tests[idx];
        test = this._testService.transformTest(test);
      }
    }
    this.updateData(tests);
  }

  public ngAfterViewInit() {
  }

  private init() {
    this.tests = new Array();
    this.limit = this.LIMIT;
    this.offset = this.OFFSET;
    this.totalRecords = this.TOTAL_RECORDS;
    this.tableData = {
      headerRow: ['name', 'description', 'duration', 'expiry_time'],
      headerRowNames: ['Name', 'Description', 'Duration', 'Expiry Time'],
      dataRows: []
    };
  }
}
