import { Routes } from '@angular/router';

import { CandidatesComponent } from './candidates.component';

export const CandidatesRoutes: Routes = [
    {
      path: '',
      children:[{
        path: '',
        component: CandidatesComponent
        }
      ]
    }
];
