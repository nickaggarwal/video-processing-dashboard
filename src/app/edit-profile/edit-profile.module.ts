import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdModule } from '../md/md.module';
import { NouisliderModule } from 'ng2-nouislider';
import { TagInputModule } from 'ngx-chips';
import { SelectModule } from 'ng2-select';
import { MaterialModule } from '../app.module';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { EditProfileRoutes } from './edit-profile.routing';
import { EditProfileService } from './edit-profile.service';
import { EditProfileComponent } from './edit-profile.component';
import { EnterpriseModule } from 'app/enterprise/enterprise.module';

@NgModule({
    imports: [
        RouterModule.forChild(EditProfileRoutes),
        CommonModule,
        FormsModule,
        MdModule,
        ReactiveFormsModule,
        NouisliderModule,
        TagInputModule,
        MaterialModule,
        InfiniteScrollModule,
        EnterpriseModule
    ],
    declarations: [
        EditProfileComponent
    ],
    providers: [EditProfileService]
})

export class EditProfileModule {}
