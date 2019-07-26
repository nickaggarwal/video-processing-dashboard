import { Injectable } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { RestService } from 'app/shared/rest/rest.service';
import { Question } from './question.model';
import { Tag } from 'app/tag/tag.model';

@Injectable()
export class QuestionsService {

  // http options used for making API calls
  private httpOptions: any;

  private limit: number;
  private offset: number;
  private totalRecords: number;

  // API for
  public api : string;

  constructor(private http: HttpClient, private restService: RestService) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
    this.api = environment.apiUrl + '' ;
  }

  public getAllQuestions(tagIds: Set<number>, offset, limit) {
    const params: Map<string, string> = this.getAllQuestionParams(tagIds, offset, limit);
    return this.restService.executeGet<Question>(environment.questionModulePath + '/filter', params);
  }

  public getQuestion(id: number) {
    const params: Map<string, string> = this.getQuestionParams(id);
    return this.restService.executeGet<Question>(environment.questionModulePath + '/id', params);
  }

  public transformQuestions(questions: Question[]) {
    if (questions.length > 0) {
      for (let idx = 0; idx < questions.length; idx++) {
        const question = questions[idx];
        this.transformQuestion(question);
      }
    }
    return questions;
  }

  public transformQuestion(question: Question) {
    question.type = question.type.replace(/_/g, ' ');
    question['difficultyLevel'] = this.getDifficultyLevel(question.tags);
    question.tags = this.transformedTags(question.tags);
    return question;
  }

  private getAllQuestionParams(tagIds: Set<number>, offset: Number, limit: Number): Map<string, string> {
    const params: Map<string, string> = new Map();
    if (tagIds) {
      params.set('tagIds', Array.from(tagIds).join(','));
    }
    params.set('sortBy', 'QUESTION_DISPLAY_ORDER');
    params.set('sortDirection', 'DESC');
    params.set('limit', limit.toString());
    params.set('offset', offset.toString());
    return params;
  }

  private getQuestionParams(id) {
    const params: Map<string, string> = new Map();
    params.set('id', id);
    return params;
  }

  private getDifficultyLevel(tags: Tag[]) {
    if (tags) {
      for (let idx = 0; idx < tags.length; idx++) {
        const tag = tags[idx];
        if (this.isDifficultyType(tag)) {
          return tag.displayName;
        }
      }
      return '';
    }
  }

  private isDifficultyType(tag: Tag) {
    return tag.tagType.name === 'DIFFICULTY_LEVEL';
  }

  private transformedTags(tags) {
    const transformedTags: Tag[] = new Array();
    if (tags) {
      for (let idx = 0; idx < tags.length; idx++) {
        const tag = tags[idx];
        if (!this.isDifficultyType(tag)) {
          transformedTags.push(tag);
        }
      }
    }
    return transformedTags;
  }

}