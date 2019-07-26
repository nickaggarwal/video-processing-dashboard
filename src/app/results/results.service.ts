import { Injectable } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class ResultsService {

  // http options used for making API calls
  private httpOptions: any;

  // API for
  public api : string;

  constructor(private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
    this.api = "http://console.codejudge.io" ;
  }

  public getAllResults(test_id){
        return this.http.get( this.api + '/api/v1/test_result/'+ test_id, this.httpOptions);
  }

}