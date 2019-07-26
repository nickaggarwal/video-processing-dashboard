import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../user/user.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-register-cmp',
    templateUrl: './register.component.html'
})

export class RegisterComponent implements OnInit, OnDestroy {
    test: Date = new Date();
    public user: any ;

    constructor(private _userService: UserService,  public router: Router) {
        if (this._userService.isAuthenticated()) {
            router.navigate(['dashboard']);
        }
        this.user = {
            username: '',
            password: '',
            email: '',
            first_name : '',
            last_name : ''
        };
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

    register(){
      this._userService.register(this.user.email, this.user.password, this.user.username, this.user.first_name, this.user.last_name);
    }
}
