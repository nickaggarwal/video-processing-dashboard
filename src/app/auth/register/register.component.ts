import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'app/auth/user/user.model';
import { Register } from './register.model';
import { UserService } from 'app/auth/user/user.service';

@Component({
    selector: 'app-auth-register',
    templateUrl: './register.component.html',
    styles: [`
    :host {
      width: 100vw;
    }`]
})

export class RegisterComponent implements OnInit, OnDestroy {
    test: Date = new Date();
    public user: Register;

    constructor(private userService: UserService,  public router: Router) {
        this.init();
    }

    init(): any {
      if (this.userService.isAuthenticated()) {
        this.router.navigate(['dashboard']);
      }
      this.initializeUser();
    }

    ngOnInit() {
      const body = document.getElementsByTagName('body')[0];
      body.classList.add('register-page');
      body.classList.add('off-canvas-sidebar');
    }

    ngOnDestroy(){
      const body = document.getElementsByTagName('body')[0];
      body.classList.remove('register-page');
      body.classList.remove('off-canvas-sidebar');
    }

    register() {
      this.userService.register(this.user).subscribe(
        data => {
          const email = this.user.email
          this.initializeUser();
          this.router.navigate(['/auth/confirm-email'], { queryParams: { email: email }});
        }
      );
    }

    public selectedChange($event) {
      this.user.entType = $event;
    }

    private initializeUser() {
      this.user = new Register();
    }
}
