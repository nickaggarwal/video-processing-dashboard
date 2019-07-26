import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
// http options used for making API calls
  private httpOptions: any;

  // the actual JWT token
  public token: string;

  // the token expiration date
  public token_expires: Date;

  // the username of the logged in user
  public username: string;

  // API for
  public api : string;

  public userId : any;

  public user : any;

  // error messages received from the login attempt
  public errors: any = [];

  constructor(private http: HttpClient, public jwtHelper: JwtHelperService, public router: Router) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
    this.api = environment.apiUrl + "" ;
  }

  // Uses http.post() to get an auth token from djangorestframework-jwt endpoint
  public login(user) {
    this.http.post( this.api + '/api-token-auth/', JSON.stringify(user), this.httpOptions).subscribe(
      data => {
        this.updateData(data['token']);
      },
      err => {
        this.errors = err['error'];
      }
    );
  }

  public getUserData() {
    this.http.get( this.api + '/api/users/' + this.userId + '/?format=json', this.httpOptions).subscribe(
      data => {
        this.updateUserProfile(data);
      },
      err => {
        this.errors = err['error'];
      }
    );
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  // Refreshes the JWT token, to extend the time the user is logged in
  public refreshToken() {
    this.http.post(this.api + '/api-token-refresh/', JSON.stringify({token: this.token}), this.httpOptions).subscribe(
      data => {
        this.updateData(data['token']);
      },
      err => {
        this.errors = err['error'];
      }
    );
  }

  public logout() {
    this.token = null;
    this.token_expires = null;
    this.username = null;
    localStorage.removeItem('access_token');
    this.router.navigate(['login']);
  }

  private updateData(token) {
    this.token = token;
    this.errors = [];

    // store the token in Local Storage
    localStorage.setItem("access_token",token);

    // decode the token to read the username and expiration timestamp
    const token_parts = this.token.split(/\./);
    const token_decoded = JSON.parse(window.atob(token_parts[1]));
    this.token_expires = new Date(token_decoded.exp * 1000);
    this.username = token_decoded.username;
    this.userId = token_decoded.user_id ;
    this.getUserData() ;
    // forward to Dashboard
  }

  private updateUserProfile(userData) {
    this.user = userData;
    localStorage.setItem('userData', JSON.stringify(userData) );
    this.router.navigate(['dashboard']);
  }

  public getUser() {
    return JSON.parse(localStorage.getItem('userData'));
  }

  /**
    * @name register
    * @desc Try to register a new user
    * @param {string} email The email entered by the user
    * @param {string} password The password entered by the user
    * @param {string} username The username entered by the user
    * @returns {Promise}
    * @memberOf thinkster.authentication.services.Authentication
    */
    public register(email, password, username, first_name, last_name) {
      this.http.post( this.api + '/api/users/', {
        username: username,
        password: password,
        email: email,
        first_name : first_name,
        last_name : last_name
      }, this.httpOptions ).subscribe(
          data => {
            this.login({'email': email, 'password': password });
          },
          err => {
            console.log(err['error']);
            this.errors = err['error'];
      });
    }



}
