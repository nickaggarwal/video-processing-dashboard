import { Component, OnInit } from '@angular/core';
import PerfectScrollbar from 'perfect-scrollbar';
import { UserService } from 'app/auth/user/user.service';
import { SharedService } from '../shared/shared.service';
import { SidebarService } from './sidebar.service';
import { User } from 'app/auth/user/user.model';

declare const $: any;

//Metadata
export interface RouteInfo {
    path: string;
    title: string;
    type: string;
    icontype: string;
    faIconType?: string;
    showHorizontalLine ?: boolean;
    collapse?: string;
    children?: ChildrenItems[];
}

export interface ChildrenItems {
    path: string;
    title: string;
    ab: string;
    type?: string;
}

//Menu Items

export const USER_ROUTES: RouteInfo[] = [{
    path: '/edit-profile',
    title: 'Profile',
    type: 'link',
    icontype: 'person_outline'
}];

export const ROUTES: RouteInfo[] = [{
        path: '/index',
        title: 'Dashboard',
        type: 'link',
        icontype: 'dashboard',
        faIconType: 'fas fa-columns'
    }, {
        path: '/questions',
        title: 'Questions',
        type: 'link',
        icontype: 'apps',
        faIconType: 'far fa-question-circle'
    }, {
        path: '/candidate-tests/wizard' ,
        title: 'Build Test' ,
        type: 'link',
        icontype: 'grid_on',
        faIconType: 'fas fa-vial'
        // collapse: 'test',
        // children: [
            // {path: 'list', title: 'List Tests', ab:'RT'},
            // {path: 'wizard', title: 'Create Test', ab:'ET'}
        // ]
    }, {
        path: '/reports/list',
        title: 'Reports',
        type: 'link',
        icontype: 'timeline',
        faIconType: 'fas fa-chart-bar'
    }, {
        path: '/candidates',
        title: 'Candidates',
        type: 'link',
        icontype: 'content_paste',
        faIconType: 'fas fa-users'
    }, {
        path: '/reports/sample/list',
        title: 'Sample Reports',
        type: 'link',
        icontype: 'timeline',
        faIconType: 'fas fa-chart-line',
        showHorizontalLine: true
    }
];
@Component({
    selector: 'app-sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public userMenuItems: any[];
    public menuItems: any[];
    public user: User;
    public isSidebarOpen = true;

    constructor(private sharedService: SharedService, private userService: UserService, private sidebarService: SidebarService) {
        this.user = this.userService.getUser();

        this.userService.subUser.subscribe(
            user => {
                this.user = user;
            }
        )

        this.sidebarService.subIsSidebarOpen.subscribe(
            isSidebarOpen => {
                this.isSidebarOpen = isSidebarOpen;
            }
        );
    }

    isMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    };

    ngOnInit() {
        this.menuItems = ROUTES;
        this.userMenuItems = USER_ROUTES;
    }

    updatePS(): void  {
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
            const ps = new PerfectScrollbar(elemSidebar, { wheelSpeed: 2, suppressScrollX: true });
        }
    }

    isMac(): boolean {
        let bool = false;
        if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
            bool = true;
        }
        return bool;
    }

    getPath() {
        return this.sharedService.navigateTo('');
    }

    getUserProfileImage() {
        return this.user.profileImageUrl ? this.user.profileImageUrl : './static/frontend/assets/img/Man-in-Suit.jpg';
    }

    getEnterpriseLogo() {
        return this.user.enterprise && this.user.enterprise.logo ? this.user.enterprise.logo : 
        './static/frontend/assets/img/codejudge-complete.png';
    }
}
