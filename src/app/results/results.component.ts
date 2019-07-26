import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ResultsService } from './results.service'
import { TestsService } from '../tests/tests.service'
import { CandidatesService } from '../candidates/candidates.service'

declare const $: any;

@Component({
  selector: 'app-test',
  templateUrl: './results.component.html'
})

export class ResultsComponent implements OnInit, AfterViewInit {

  public candidate_tests: any ;

  constructor(private _resultService: ResultsService, private _testService :TestsService, private _candidateService :CandidatesService,) {
    this.candidate_tests = [] ;
  }

  public updateData(data) {
    console.log(data);
    for(var i=0 ; i < this.candidate_tests.length ; i++ ){
        if(data.id == this.candidate_tests[i].test ){
            this.candidate_tests[i].test_data = data;
        }
    }
    console.log(this.candidate_tests);
  }

  public updateResultData(data) {
    console.log(data);
    for(var i=0 ; i < this.candidate_tests.length ; i++ ){
        if(data.test_id == this.candidate_tests[i].id ){
            this.candidate_tests[i].result_data = data;
        }
    }
    console.log(this.candidate_tests);
  }

  public updateCandidateTestData(data) {
    console.log(data);
    this.candidate_tests = data ;
    for(var i=0; i < this.candidate_tests.length ; i++ ){
        this._testService.getTest(this.candidate_tests[i].test).subscribe(
          data => {
            this.updateData(data);
          },
          err => {
            this.alertFn(err);
          }
        );
        this._resultService.getAllResults(this.candidate_tests[i].id).subscribe(
          data => {
            this.updateResultData(data);
          },
          err => {
            this.alertFn(err);
          }
        );
    }
  }

  public alertFn(error){
    console.log(error);
    alert("Error getting Data");
  }

  public ngOnInit() {
      this._candidateService.getAllCandidateTest().subscribe(
          data => {
            this.updateCandidateTestData(data);
          },
          err => {
            this.alertFn(err);
          }
      );
  }


  public ngAfterViewInit(){
  }

}
