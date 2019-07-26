import { Component, OnInit, AfterViewInit } from '@angular/core';
import { QuestionsService } from './questions.service'
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'app/shared/shared.service';
declare const $: any;

@Component({
  selector: 'app-test',
  templateUrl: './questions.component.html'
})

export class QuestionsComponent implements OnInit, AfterViewInit {
  private LIMIT = 6;
  private OFFSET = 0;
  private TOTAL_RECORDS = 0;
  private limit: number;
  private offset: number;
  public totalRecords: number;
  public questions: Array<any>;
  public tagIds: Set<number> = new Set();
  private fetchingData = false;

  constructor(private route: ActivatedRoute, private router: Router, private _questionService: QuestionsService, 
              private sharedService: SharedService) {
    this.init();
  }

  public getPath(question) {
    return '/questions/detail/' + question.id;
  }

  public updateData(data) {
    this.questions = this.questions.concat(data);
  }

  public onScroll() {
    this.getQuestions();
  }

  public viewQuestion(question) {
    this.sharedService.navigateTo(this.getPath(question));
  }

  public ngOnInit() {
    this.route.params.subscribe(params => {
      const ids = params['tagIds'];
      this.tagIds = ids ? ids.split(',') : undefined;
      if (!this.tagIds || this.tagIds.size === 0) {
        this.init();
        this.getQuestions();
      }
    });
  }

  public selectedTagsChange(selectedTagIds: Set<number>) {
    this.init();
    this.router.navigate(['/questions/' + Array.from(selectedTagIds).join(',')]);
    this.tagIds = selectedTagIds;
    this.getQuestions();
  }

  private getQuestions() {
    if (!this.fetchingData && (this.totalRecords === this.TOTAL_RECORDS || this.totalRecords > this.offset)) {
      this.fetchingData = true;
      this._questionService.getAllQuestions(this.tagIds, this.offset, this.limit).subscribe(
        data => {
          const response = data['response'];
          this.totalRecords = response['totalRecords'];
          const questions = this._questionService.transformQuestions(response['questions']);
          if (this.offset === this.limit) {
            this.questions = questions;
          } else {
            this.updateData(questions);
          }
          this.postFetching();
        },
        err => {
          this.postFetching();
        }
      );
      this.offset += this.limit;
    }
  }

  private postFetching() {
    this.fetchingData = false;
  }

  private init() {
    this.questions = new Array<any>();
    this.tagIds = new Set<number>();
    this.limit = this.LIMIT;
    this.offset = this.OFFSET;
    this.totalRecords = this.TOTAL_RECORDS;
  }

  public ngAfterViewInit() {
  }

}
