import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user/user.service';
import { NotificationsComponent } from 'app/notifications/notifications.component';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  test: Date = new Date();
  email: string = undefined;

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService, 
    private notificationComponent: NotificationsComponent) { }

  ngOnInit() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('login-page');
    body.classList.add('off-canvas-sidebar');
  }

  public forgotPassword() {
    this.validateEmail();
    this.userService.forgotPassword(this.email);
  }

  public isValidEmail() {
    return this.email ? true : false;
  }

  private validateEmail() {
    if (!this.isValidEmail()) {
      this.notificationComponent.showNotification('danger', 'Please enter the email!');
      throw new Error('Please enter the email!');
    }
  }

  ngOnDestroy() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('login-page');
    body.classList.remove('off-canvas-sidebar');
  }
}