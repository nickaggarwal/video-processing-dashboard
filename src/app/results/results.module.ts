import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdModule } from '../md/md.module';

import { ResultsComponent } from './results.component';
import { ResultsRoutes } from './results.routing';
import { ResultsService } from './results.service';

import { TestsService } from '../tests/tests.service';
import { CandidatesService } from '../candidates/candidates.service';

@NgModule({
    imports: [
        RouterModule.forChild(ResultsRoutes),
        CommonModule,
        FormsModule,
        MdModule
    ],
    declarations: [ResultsComponent],
    providers: [ResultsService, TestsService, CandidatesService]
})

export class ResultsModule {}
