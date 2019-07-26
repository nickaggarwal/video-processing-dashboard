import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdModule } from '../md/md.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { QuestionsComponent } from './questions.component';
import { QuestionsRoutes } from './questions.routing';
import { QuestionsService } from './questions.service';
import { TagFilterModule } from '../tag/tag-filter/tag-filter.module';
import { QuestionFilterComponent } from './question-filter/question-filter.component';
import { QuestionFilterModule } from './question-filter/question-filter.module';
import { QuestionDetailComponent } from './question-detail/question-detail.component';
import { QuestionOverviewCardComponent } from './question-overview-card/question-overview-card.component';

@NgModule({
    imports: [
        RouterModule.forChild(QuestionsRoutes),
        CommonModule,
        FormsModule,
        MdModule,
        InfiniteScrollModule,
        QuestionFilterModule
    ],
    declarations: [QuestionsComponent, QuestionDetailComponent, QuestionOverviewCardComponent],
    providers: [QuestionsService]
})

export class QuestionsModule {}
