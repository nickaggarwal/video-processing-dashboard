import { Injectable } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router, ParamMap } from '@angular/router';
import { Register } from 'app/auth/register/register.model';
import { User } from 'app/auth/user/user.model';
import { Enterprise } from 'app/enterprise/common/enterprise.model';
import { Observable, Subject } from 'rxjs';
import { CommonConstants } from 'app/shared/shared.constants';
import { RestService } from 'app/shared/rest/rest.service';
import { NotificationsComponent } from 'app/notifications/notifications.component';


@Injectable({
    providedIn: 'root'
})
export class SidebarService {
    public user: User;
    public confirmEmailAddress: string;
    public isSidebarOpen = true;
    public subIsSidebarOpen: Subject<boolean> = new Subject<boolean>();

    constructor(public router: Router, private restService: RestService, private notificationComponent: NotificationsComponent) {
        this.subIsSidebarOpen.subscribe((value) => {
            this.isSidebarOpen = value;
        });
    }

    public toggleSidebar() {
        this.subIsSidebarOpen.next(!this.isSidebarOpen);
    }
}