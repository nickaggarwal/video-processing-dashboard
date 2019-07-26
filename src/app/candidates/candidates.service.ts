import { Injectable } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Candidate } from './candidate.model';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class CandidatesService {

  // http options used for making API calls
  private httpOptions: any;

  // API for
  public api : string;

  constructor(private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
    this.api = environment.apiUrl + "" ;
  }

  public getAllCandidatesForTest(test_id){
        return this.http.get( this.api + '/api/candidate-tests/?test='+test_id, this.httpOptions);
  }

  public getAllCandidateTest(){
        return this.http.get( this.api + '/api/candidate-tests/', this.httpOptions);
  }

  public getCandidate(email){
        return this.http.get( this.api + '/api/candidates/?email=' + email, this.httpOptions);
  }

  public getAllCandidates(offset, limit) {
        return this.http.get( this.api + '/api/candidates/?offset=' + offset + '&limit=' + limit, this.httpOptions);
  }

  /**
    * @name Add Questions to Test
    * @desc Adding a New test
    * @param {Test Object to Create }
    * @returns {Promise}
    */
    public addTestCandidate(test_id , candidate_id) {
      var test_candidate = { "test" : test_id , "candidate": candidate_id } ;
      console.log(test_candidate);
      return this.http.post( this.api + '/api/candidate-tests/',  test_candidate , this.httpOptions ) ;
    }

    /**
    * @name Add Questions to Test
    * @desc Adding a New test
    * @param { Test Object to Create }
    * @returns {Promise}
    */
    public addCandidate(first_name, last_name, email) {
      var candidate = { "name" : first_name+" "+last_name , "email": email } ;
      console.log(candidate);
      return this.http.post( this.api + '/api/candidates/',  candidate , this.httpOptions ) ;
    }

  public readFile(file: File): Observable<Candidate[]> {
    if (file) {
      let formData = new FormData(); 
      formData.append('file', file); 
      return this.http.post<Candidate[]>(this.api + '/api/read-candidate-file/', formData);
    }
  }

  public downloadCandidateTemplate(): any {
    return this.http.post( this.api + '/api/export-candidate-template/', {}, {
      responseType: "blob",
      headers: new HttpHeaders().append("Content-Type", "application/json")
    }) ;
  }

}