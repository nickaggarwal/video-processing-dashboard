import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { UserService } from '../../user/user.service';
import { Router } from '@angular/router';

declare var $: any;

@Component({
    selector: 'app-login-cmp',
    templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit, OnDestroy {
    test: Date = new Date();
    private toggleButton: any;
    private sidebarVisible: boolean;
    private nativeElement: Node;
    public user: any ;

    constructor(private element: ElementRef, private _userService: UserService,  public router: Router) {
        if (this._userService.isAuthenticated()) {
            router.navigate(['dashboard']);
        }
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;
        this.user = {
            username: '',
            password: ''
        };
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }

    login() {
        this._userService.login({'email': this.user.username, 'password': this.user.password});
    }

    refreshToken() {
        this._userService.refreshToken();
    }

    logout() {
        this._userService.logout();
    }
}
