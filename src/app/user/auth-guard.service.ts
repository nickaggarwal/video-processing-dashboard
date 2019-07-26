import { Injectable } from '@angular/core';
import { Router, CanActivate, NavigationEnd } from '@angular/router';
import { UserService } from '../auth/user/user.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  currentUrl: string;
  constructor(public auth: UserService, public router: Router) {}

  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}