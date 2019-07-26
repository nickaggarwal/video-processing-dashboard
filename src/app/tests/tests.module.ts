import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NouisliderModule } from 'ng2-nouislider';
import { TagInputModule } from 'ngx-chips';
import { SelectModule } from 'ng2-select';
import { MaterialModule } from '../app.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FileSaverModule } from 'ngx-filesaver';
import { NgSelectModule } from '@ng-select/ng-select';

import { TestsComponent } from './tests.component';
import { TestWizardComponent } from './wizard/wizard.component';
import { TestsRoutes } from './tests.routing';
import { TestsService } from './tests.service';

import { QuestionsService } from '../questions/questions.service'
import { CandidatesService } from '../candidates/candidates.service';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { TestDetailComponent } from './test-detail/test-detail.component';
import { TagFilterModule } from '../tag/tag-filter/tag-filter.module';
import { DataTableModule } from '../data-table/data-table.module';
import { TestCandidateDetailComponent } from './test-candidate-detail/test-candidate-detail.component';
import { QuestionFilterModule } from 'app/questions/question-filter/question-filter.module';
import { EnhancedDataTableModule } from 'app/enhanced-data-table/enhanced-data-table.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(TestsRoutes),
    FormsModule,
    ReactiveFormsModule,
    NouisliderModule,
    TagInputModule,
    MaterialModule,
    OwlDateTimeModule, 
    OwlNativeDateTimeModule,
    InfiniteScrollModule,
    QuestionFilterModule,
    DataTableModule,
    FileSaverModule,
    NgSelectModule,
    EnhancedDataTableModule
  ],
  declarations: [
      TestWizardComponent,
      TestsComponent,
      TestDetailComponent,
      TestCandidateDetailComponent
  ],
  providers: [TestsService, CandidatesService, QuestionsService]
})

export class TestsModule {}
