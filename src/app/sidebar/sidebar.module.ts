import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

@NgModule({
    imports: [ RouterModule, CommonModule, AngularFontAwesomeModule ],
    declarations: [ SidebarComponent ],
    exports: [ SidebarComponent ]
})

export class SidebarModule {}
