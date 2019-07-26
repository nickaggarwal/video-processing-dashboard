import { Injectable } from '@angular/core';
import { Router, CanActivate, NavigationEnd } from '@angular/router';
import { UserService } from '../auth/user/user.service';

@Injectable()
export class LoginGuardService implements CanActivate {
  currentUrl: string;
  constructor(public auth: UserService, public router: Router) {}

  canActivate(): boolean {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['dashboard']);
      return false;
    }
    return true;
  }
}