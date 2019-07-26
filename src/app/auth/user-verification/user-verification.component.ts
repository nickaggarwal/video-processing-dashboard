import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { RestService } from '../../shared/rest/rest.service';
import { environment } from 'environments/environment';
import { UserService } from '../user/user.service';
import 'rxjs/add/operator/finally';

@Component({
  selector: 'app-user-verification',
  templateUrl: './user-verification.component.html',
  styleUrls: ['./user-verification.component.scss']
})
export class UserVerificationComponent implements OnInit, OnDestroy{
  test: Date = new Date();
  isVerificationSuccessful = false;
  message = '';

  constructor(private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('login-page');
    body.classList.add('off-canvas-sidebar');

    this.userService.verifyCode(this.route.snapshot.queryParamMap).subscribe(data => {
      console.log(data['response']);
      this.isVerificationSuccessful = true;
      this.message = 'Your account has been verified successfully!';
    }, err => {
      this.isVerificationSuccessful = false;
      this.message = err;
    });
  }

  ngOnDestroy() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('login-page');
    body.classList.remove('off-canvas-sidebar');
  }
}
