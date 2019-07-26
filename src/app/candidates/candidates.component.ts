import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TableData } from '../md/md-table/md-table.component';
import { CandidatesService } from './candidates.service'
declare const $: any;

@Component({
  selector: 'app-test',
  templateUrl: './candidates.component.html'
})

export class CandidatesComponent implements OnInit, AfterViewInit {
  private LIMIT = 6;
  private OFFSET = 0;
  private TOTAL_RECORDS = 0;
  private limit: number;
  private offset: number;
  public totalRecords: number;
  public candidates: any;
  private fetchingData = false;

  constructor(private _candidateService: CandidatesService) {
    this.candidates = [] ;
  }

  public updateData(data) {
    this.candidates = this.candidates.concat(data);
  }

  public updateNewCandidate(data) {
    this.candidates.push(data) ;
  }

  public alertFn(error) {
    console.log(error);
    alert('Error getting Data');
  }

  public ngOnInit() {
    this.init()
    this.getCandidates();
  }

  public onScroll() {
    this.getCandidates();
  }

  private getCandidates() {
    if (!this.fetchingData && (this.totalRecords === this.TOTAL_RECORDS || this.totalRecords > this.offset)) {
      this.fetchingData = true;
      this._candidateService.getAllCandidates(this.offset, this.limit).subscribe(
        data => {
          this.totalRecords = data['count'];
          this.updateData(data['results']);
          this.postFetching();
        },
        err => {
          this.postFetching();
        }
      );
      this.offset += this.limit;
    }
  }

  public ngAfterViewInit() {
  }

  private postFetching() {
    this.fetchingData = false;
  }

  private init() {
    this.candidates = new Array<any>();
    this.limit = this.LIMIT;
    this.offset = this.OFFSET;
    this.totalRecords = this.TOTAL_RECORDS;
  }

  submitCandidateForm(){
      this._candidateService.addCandidate( $('#firstName').val(), $('#lastName').val(), $('#email').val()).subscribe(
          data => {
            this.updateNewCandidate(data);
          },
          err => {
            console.log(err);
          }
      );

    }

}
