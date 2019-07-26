import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionsService } from '../questions.service';
import { Question } from '../question.model';

@Component({
  selector: 'app-question-detail',
  templateUrl: './question-detail.component.html',
  styleUrls: ['./question-detail.component.scss']
})
export class QuestionDetailComponent implements OnInit {
  private id: number;
  public question: Question;

  constructor(private route: ActivatedRoute, private questionService: QuestionsService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id']; // (+) converts string 'id' to a number
      this.questionService.getQuestion(this.id).subscribe(
        data => {
          this.question = this.questionService.transformQuestion(data['response']);
        }
      );
    });
  }
}
