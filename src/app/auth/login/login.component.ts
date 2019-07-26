import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Login } from './login.model';
import { UserService } from '../user/user.service';

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
    public user: Login ;


    constructor(private element: ElementRef, private userService: UserService,  public router: Router) {
        if (this.userService.isAuthenticated()) {
            router.navigate(['dashboard']);
        }
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;
        this.user = new Login();
    }

    ngOnInit() {
        var navbar : HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
        const body = document.getElementsByTagName('body')[0];
        body.classList.add('login-page');
        body.classList.add('off-canvas-sidebar');
        // const card = document.getElementsByClassName('card')[0];
        // setTimeout(function() {
            // after 1000 ms we add the class animated to the login/register card
            // card.classList.remove('card-hidden');
        // }, 700);
    }
    sidebarToggle() {
        var toggleButton = this.toggleButton;
        var body = document.getElementsByTagName('body')[0];
        var sidebar = document.getElementsByClassName('navbar-collapse')[0];
        if (this.sidebarVisible == false) {
            setTimeout(function() {
                toggleButton.classList.add('toggled');
            }, 500);
            body.classList.add('nav-open');
            this.sidebarVisible = true;
        } else {
            this.toggleButton.classList.remove('toggled');
            this.sidebarVisible = false;
            body.classList.remove('nav-open');
        }
    }
    ngOnDestroy(){
      const body = document.getElementsByTagName('body')[0];
      body.classList.remove('login-page');
      body.classList.remove('off-canvas-sidebar');
    }
    login() {
        console.log(this.user);
        this.userService.login(this.user);
    }

    logout() {
        this.userService.logout();
    }
}
