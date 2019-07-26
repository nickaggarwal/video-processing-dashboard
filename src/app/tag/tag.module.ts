import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { MatCheckboxModule, MatIconModule, MatButtonModule, MatButtonToggleModule, MatSelectModule, MatInputModule } from '@angular/material';
import { MatTreeModule } from '@angular/material/tree';
import { TagInputModule } from 'ngx-chips';
import { MdModule } from 'app/md/md.module';
import { TagTypeComponent } from './tag-type/tag-type.component';
import { TagComponent } from './tag.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MdModule,
        InfiniteScrollModule,
    ],
    declarations: [TagTypeComponent, TagComponent],
    providers: [],
    exports: [
        TagTypeComponent, TagComponent
    ]
})

export class TagFilterModule {}
