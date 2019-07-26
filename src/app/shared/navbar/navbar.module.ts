import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { MatButtonModule } from '@angular/material';
import { SidebarModule } from 'app/sidebar/sidebar.module';
@NgModule({
    imports: [ RouterModule, CommonModule, MatButtonModule, SidebarModule ],
    declarations: [ NavbarComponent ],
    exports: [ NavbarComponent ]
})

export class NavbarModule {}
