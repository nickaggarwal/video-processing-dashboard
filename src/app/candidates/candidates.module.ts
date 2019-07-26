import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdModule } from '../md/md.module';
import { NouisliderModule } from 'ng2-nouislider';
import { TagInputModule } from 'ngx-chips';
import { SelectModule } from 'ng2-select';
import { MaterialModule } from '../app.module';

import { CandidatesComponent } from './candidates.component';
import { CandidatesRoutes } from './candidates.routing';
import { CandidatesService } from './candidates.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
    imports: [
        RouterModule.forChild(CandidatesRoutes),
        CommonModule,
        FormsModule,
        MdModule,
        ReactiveFormsModule,
        NouisliderModule,
        TagInputModule,
        MaterialModule,
        InfiniteScrollModule,
    ],
    declarations: [
      CandidatesComponent
    ],
    providers: [CandidatesService]
})

export class CandidatesModule {}
