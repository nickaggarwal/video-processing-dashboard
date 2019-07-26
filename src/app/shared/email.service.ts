import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { NotificationsComponent } from '../notifications/notifications.component';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private httpOptions: any;

  // API for
  public api : string;

  constructor(private http: HttpClient, private notificationComponent: NotificationsComponent) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
    this.api = environment.apiUrl + "" ;
  }

  public resendTestLink(test_id, candidate_id) {
    let params = '';
    if (test_id) {
      params = "?test_id=" + test_id;
      params += (candidate_id ? "&candidate_id=" + candidate_id : "");  
      return this.http.get( this.api + '/api/test/send-email/' + params, this.httpOptions);
    } else {
      this.notificationComponent.showNotification('danger', "Test id can't be empty!");
      throw new Error("Test id can't be empty!");
    }
  }

}
