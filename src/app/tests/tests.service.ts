import { Injectable } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { RestService } from '../shared/rest/rest.service';
import { SharedService } from '../shared/shared.service';

@Injectable()
export class TestsService {

  // http options used for making API calls
  private httpOptions: any;

  private token: string;

  // API for
  public api : string;
  private developerApi: string;

  private isSamplePage = false;

  constructor(private http: HttpClient, private restService: RestService, private sharedService: SharedService) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json' })
    };
    this.api = environment.apiUrl + '';
    this.developerApi = environment.developerApiUrl + '';
  }

  // Uses http.post(successfn, errorFn) to get an auth token from djangorestframework-jwt endpoint
  public getAllTests(offset, limit) {
        return this.http.get( this.api + '/api/tests/?offset=' + offset + '&limit=' + limit, this.httpOptions);
  }

  public getAllSampleTests() {
    return this.http.get( this.api + '/api/tests/sample/', this.httpOptions);
}

  public addTestInfo(test, questionIds, candidates) {
    var testInfo = test;
    testInfo['question_ids'] = questionIds;
    testInfo['candidates'] = candidates;
    return this.http.post( this.api + '/api/test/info/', testInfo, this.httpOptions  );
  }

  // Uses http.post(successfn, errorFn) to get an auth token from djangorestframework-jwt endpoint
  public getTest(test_id){
        return this.http.get( this.api + '/api/test/detail/?test_id=' + test_id , this.httpOptions);
  }

  public getSampleTest(test_id){
    return this.http.get( this.api + '/api/test/detail/sample/?test_id=' + test_id , this.httpOptions);
}

  /**
    * @name Add Test
    * @desc Adding a New test
    * @param {Test Object to Create }
    * @returns {Promise}
    */
    public addTest(test) {
      return this.http.post( this.api + '/api/tests/', test , this.httpOptions  );
    }

  /**
    * @name Add Questions to Test
    * @desc Adding a New test
    * @param {Test Object to Create }
    * @returns {Promise}
    */
    public addTestQuestions(test_id , question_id) {
      var test_question = { "test" : test_id , "questions": question_id } ;
      return this.http.post( this.api + '/api/test-questions/',  test_question , this.httpOptions ) ;
    }

  /**
    * @name Add Candidate to Test
    * @desc andidate to Test
    * @param {Test Candidate to Create }
    * @returns {Promise}
    */
    public addTestCandidateId( candidate_id , test_id ) {
      var test_question = { "test" : test_id , "candidate": candidate_id} ;
      return this.http.post( this.api + '/api/candidate-tests/',  test_question , this.httpOptions ) ;
    }

    /**
    * @name Add Candidate to Test
    * @desc andidate to Test
    * @param {Test Candidate to Create }
    * @returns {Promise}
    */
    public sendEmail(test_id) {
      return this.http.get( this.api + '/api/send-email/?test_id=' + test_id , this.httpOptions ) ;
    }

    public getDuration(duration) {
      return this.sharedService.convertSecondsToString(duration);
    }

    public getExpiryTime(expiryTime) {
      return this.sharedService.getLocalTime(expiryTime, 'NA');
    }

    public getCandidateTestSubmissionDetails(uuid) {
      return this.http.get( this.api + '/api/test/candidate-submission-details/?uuid=' + uuid , this.httpOptions ) ;
    }

    public getSampleCandidateTestSubmissionDetails(uuid) {
      return this.http.get( this.api + '/api/test/candidate-submission-details/sample/?uuid=' + uuid , this.httpOptions ) ;
    }

    public getCandidateTestSubmissionMetadata(submissionId) {
      return this.http.get( this.developerApi + '/api/v1/submission_result/?id=' + submissionId , this.httpOptions ) ;
    }

    public getCandidateProgrammingTestSubmissionMetadata(submissionId) {
      return this.http.get( this.developerApi + '/api/v1/submission-test-case/?submission_id=' + submissionId , this.httpOptions ) ;
    }

    public downloadReport(submissionId, uuid) {
      return this.http.get( this.api + '/api/v1/submission-pdf/?id=' + submissionId + '&uuid=' + uuid , {
        responseType: 'blob',
        headers: new HttpHeaders().append('Accept', 'application/json').append('Accept', 'text/plain').append('Accept', '*/*')
                                  .append('noContent', 'true')
      }) ;
    }

    public downloadSampleReport(submissionId, uuid) {
      return this.http.get( this.api + '/api/v1/submission-pdf/sample/?id=' + submissionId + '&uuid=' + uuid , {
        responseType: 'blob',
        headers: new HttpHeaders().append('Accept', 'application/json').append('Accept', 'text/plain').append('Accept', '*/*')
                                  .append('noContent', 'true')
      }) ;
    }

    public downloadTestReport(testId: number) {
      return this.http.get( this.api + '/api/test/report/?id=' + testId, {
        responseType: 'blob',
        headers: new HttpHeaders().append('Accept', 'application/json').append('Accept', 'text/plain').append('Accept', '*/*')
                                  .append('noContent', 'true')
      }) ;
    }

    public downloadSampleTestReport(testId: number) {
      return this.http.get( this.api + '/api/test/report/sample/?id=' + testId, {
        responseType: 'blob',
        headers: new HttpHeaders().append('Accept', 'application/json').append('Accept', 'text/plain').append('Accept', '*/*')
                                  .append('noContent', 'true')
      }) ;
    }

    public downloadCandidateTestReport(testId: number, candidateId: number) {
      return this.http.get( this.api + '/api/test-candidate/report/?id=' + testId + '&candidate_id=' + candidateId, {
        responseType: 'blob',
        headers: new HttpHeaders().append('Accept', 'application/json').append('Accept', 'text/plain').append('Accept', '*/*')
                                  .append('noContent', 'true')
      }) ;
    }

    public downloadSampleCandidateTestReport(testId: number, candidateId: number) {
      return this.http.get( this.api + '/api/test-candidate/report/sample/?id=' + testId + '&candidate_id=' + candidateId, {
        responseType: 'blob',
        headers: new HttpHeaders().append('Accept', 'application/json').append('Accept', 'text/plain').append('Accept', '*/*')
                                  .append('noContent', 'true')
      }) ;
    }

    public setIsSampleFlag(url) {
      if (url) {
        if (url.indexOf('sample') > -1) {
          this.isSamplePage = true;
          return;
        }
      }
      this.isSamplePage = false;
    }

    public getIsSampleFlag() {
      return this.isSamplePage;
    }

    public transformTest(data) {
      data['duration'] = this.getDuration(data['duration']);
      data['expiry_time'] = this.getExpiryTime(data['expiry_time']);
      return data;
    }
}