import { Injectable } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router, ParamMap } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Register } from 'app/auth/register/register.model';
import { User } from 'app/auth/user/user.model';
import { Enterprise } from 'app/enterprise/common/enterprise.model';
import { RestService } from '../../shared/rest/rest.service';
import { Observable, Subject } from 'rxjs';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { Login } from '../login/login.model';
import { CommonConstants } from 'app/shared/shared.constants';
import { Header } from '../../shared/rest/header.model';
import { EnterpriseService } from 'app/enterprise/common/enterprise.service';
import { SharedService } from 'app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public user: User;
  public confirmEmailAddress: string;
  public subUser: Subject<User> = new Subject<User>();

  constructor(public router: Router, private restService: RestService, private enterpriseService: EnterpriseService,
    private notificationComponent: NotificationsComponent, private sharedService: SharedService) {
    this.subUser.subscribe((value) => {
      this.user = value;
    });
  }

  public register(register: Register) {
    this.user = User.getUserForRegistration(register);
    const enterprise = Enterprise.getEnterprise(register);

    return this.restService.executePost(environment.userModulePath + '/signup/recruiter', {
      user : this.user,
      enterprise : enterprise
    })
  }

  public verifyCode(map: ParamMap): Observable<User> {
    const paramsStr: string = this.getVerificationCodeParams(map['params']);
    return this.restService.executePost<User>(environment.userModulePath + '/verify-code?' + paramsStr, {});
  }

  public resendVerificationEmail(email: string) {
    return this.restService.executePost(environment.userModulePath + '/resend-verification-link/recruiter?email=' + email, {}).subscribe(
      data => {
        console.log(data['response']);
      }
    );
  }

  public forgotPassword(email: string) {
    return this.restService.executePost(environment.userModulePath + '/forgot-password/recruiter?email=' + email, {}).subscribe(
      data => {
        console.log(data['response']);
      }
    );
  }

  public changePassword(paramsMap: any) {
    return this.restService.executePost<User>(environment.userModulePath + '/change-password', paramsMap);
  }

  public login(login: Login) {
    this.user = User.getUserForLogin(login);

    return this.restService.executePost(environment.userModulePath + '/login/recruiter', this.user).subscribe(data => {
      this.postUserAction(data['response'], 'LOGIN', 'dashboard');
    });
  }

  public isAuthenticated(): boolean {
    const headerJson = localStorage.getItem(CommonConstants.CJ_HEADER_KEY);
    if (headerJson) {
      const header: Header = JSON.parse(headerJson);
      return Header.hasUserIdentificatonInfo(header);
    }
    return false;
  }

  public getUser() {
    return JSON.parse(localStorage.getItem(CommonConstants.USER_DATA_KEY));
  }

  public updateProfile(user: User, file: File) {
    const formData = new FormData();
    formData.append('model', JSON.stringify(user));
    if (file) {
      formData.append('file', file)
    }
    this.restService.executePost(environment.userModulePath + '/update-profile', formData).subscribe(
      data => {
        this.postUserAction(data['response'], 'UPDATE_PROFILE', undefined);
      }
    );
  }
 
  public logout() {
    this.restService.executePost(environment.userModulePath + '/logout', {}).subscribe(data => {
      this.postUserAction(null, 'LOGOUT', 'login');
    });
  }

  public postLogoUpload(logo: string) {
    this.user = this.getUser();
    this.user.enterprise.logo = logo;
    this.publishUserAndSetLocalStorage();
    this.navigateTo(undefined);
  }

  private getVerificationCodeParams(paramsMap: any) {
    let paramsStr = '';
    for (const key in paramsMap) {
      if (paramsMap.hasOwnProperty(key)) {
        const element = paramsMap[key];
        paramsStr = paramsStr == '' ? paramsStr : paramsStr + '&';
        paramsStr += key + '=' + element;
      }
    }
    if (paramsStr.length == 0) {
      const errorMessage = 'User Verification Params are empty!';
      this.notificationComponent.showNotification('danger', errorMessage);
      throw new Error(errorMessage);
    }
    return paramsStr;
  }

  private postUserAction(response: any, action: string, navigateTo: string) {
    if (action === 'LOGIN') {
      this.user = response;
      this.enterpriseService.getEnterprise(this.user.entId).subscribe(
        data => {
          this.user.enterprise = data['response'];
          this.publishUserAndSetLocalStorage();
          this.navigateTo(navigateTo);
        }
      );
    } else if (action === 'LOGOUT') {
        this.user = response;
        localStorage.removeItem(CommonConstants.CJ_HEADER_KEY);
        localStorage.removeItem(CommonConstants.USER_DATA_KEY);
        this.navigateTo(navigateTo);
    } else if (action === 'UPDATE_PROFILE') {
        const enterprise = this.getUser().enterprise;
        this.user = response;
        this.user.enterprise = enterprise;
        this.publishUserAndSetLocalStorage();
        this.navigateTo(navigateTo);
    }
  }

  private navigateTo(navigateTo: string) {
    if (navigateTo) {
      this.sharedService.navigateTo(navigateTo);
    }
  }

  private publishUserAndSetLocalStorage() {
    this.subUser.next(this.user);
    localStorage.setItem(CommonConstants.CJ_HEADER_KEY, JSON.stringify(Header.build(this.user.currentUserDevice)));
    localStorage.setItem(CommonConstants.USER_DATA_KEY, JSON.stringify(this.user));
  }
}