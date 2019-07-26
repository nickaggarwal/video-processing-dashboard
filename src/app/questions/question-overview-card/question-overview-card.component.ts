import { Component, OnInit, Input } from '@angular/core';
import { Question } from '../question.model';

@Component({
  selector: 'app-question-overview-card',
  templateUrl: './question-overview-card.component.html',
  styleUrls: ['./question-overview-card.component.scss']
})
export class QuestionOverviewCardComponent implements OnInit {

  @Input()
  public question: Question;

  @Input()
  public index: number = undefined;

  constructor() { }

  ngOnInit() {
  }

}
