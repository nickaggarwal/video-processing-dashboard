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
import { TagFilterComponent } from './tag-filter.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MdModule,
        InfiniteScrollModule,
        MatCheckboxModule,
        MatTreeModule,
        MatFormFieldModule,
        MatIconModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatSelectModule,
        MatInputModule,
        TagInputModule
    ],
    declarations: [TagFilterComponent],
    providers: [],
    exports: [
        TagFilterComponent
    ]
})

export class TagFilterModule {}
