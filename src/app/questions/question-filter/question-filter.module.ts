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
import { QuestionFilterComponent } from './question-filter.component';
import { TagFilterModule } from 'app/tag/tag-filter/tag-filter.module';

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
        TagInputModule,
        TagFilterModule
    ],
    declarations: [QuestionFilterComponent],
    providers: [],
    exports: [
        QuestionFilterComponent
    ]
})

export class QuestionFilterModule {}
