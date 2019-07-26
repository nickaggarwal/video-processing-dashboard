import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { UserService } from '../user/user.service';
import { NotificationsComponent } from 'app/notifications/notifications.component';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  test: Date = new Date();
  params: any;
  changePasswordSuccessful = false;
  message = '';
  paramsMap: any;
  password: string;
  confirmPassword: string;

  constructor(private route: ActivatedRoute, private userService: UserService, private notificationComponent: NotificationsComponent) { }

  ngOnInit() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('login-page');
    body.classList.add('off-canvas-sidebar');
    this.paramsMap = this.route.snapshot.queryParamMap['params'];
  }

  public changePassword() {
    this.validateParamsMap();
    if (this.arePasswordsPresent()) {
      if (this.arePasswordsEqual()) {
        this.params = {
          'email': this.paramsMap['email'],
          'password': this.password,
          'forgotPasswordCode': this.paramsMap['code']
        }
        this.userService.changePassword(this.params).subscribe(data => {
          this.changePasswordSuccessful = true;
          this.message = 'Your password has been changed successfully!';
        }, err => {
          this.changePasswordSuccessful = false;
        });
      } else {
        this.notificationComponent.showNotification('danger', 'Passwords don\'t match!');
        throw new Error('Passwords don\'t match!');
      }
    } else {
      this.notificationComponent.showNotification('danger', 'Password is missing!')
      throw new Error('Password is missing!');
    }
  }

  public isValidPasswordInfo() {
    if (this.isValidParamsMap() && this.isValidPasswords()) {
      return true;
    }
    return false;
  }

  private isValidParamsMap() {
    for (const key in this.paramsMap) {
      if (this.isNotValidEmailAndCode(key)) {
        return false;
      }
    }
    return true;
  }

  private isValidPasswords() {
    if (this.arePasswordsPresent()) {
      if (this.arePasswordsEqual()) {
        return true;
      }
    }
    return false;
  }

  private arePasswordsPresent() {
    return this.password && this.confirmPassword;
  }

  private arePasswordsEqual() {
    return this.password === this.confirmPassword;
  }

  private validateParamsMap() {
    for (const key in this.paramsMap) {
      if (this.isNotValidEmailAndCode(key)) {
        this.notificationComponent.showNotification('danger', 'Email and/or Code missing!')
        throw new Error('Email and/or Code missing!');
      }
    }
  }

  private isNotValidEmailAndCode(key) {
    return key && key !== 'email' && key !== 'code';
  }

  ngOnDestroy() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('login-page');
    body.classList.remove('off-canvas-sidebar');
  }
}
