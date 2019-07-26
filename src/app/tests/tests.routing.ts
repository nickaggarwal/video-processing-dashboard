import { Routes } from '@angular/router';

import { TestsComponent } from './tests.component';
import { TestWizardComponent } from './wizard/wizard.component';
import { TestDetailComponent } from './test-detail/test-detail.component';
import { TestCandidateDetailComponent } from './test-candidate-detail/test-candidate-detail.component';


export const TestsRoutes: Routes = [
    // {
    //     path: '',
    //     children: [{
    //         path: 'list',
    //         component: TestsComponent
    //     }]
    // },
    {
        path: '',
        children: [{
            path: 'list',
            component: TestsComponent
        }, {
            path: 'sample/list',
            component: TestsComponent
        }, {
            path: 'wizard',
            component: TestWizardComponent
        }, {
            path: 'detail/:id',
            component: TestDetailComponent
        }, {
            path: 'sample/detail/:id',
            component: TestDetailComponent
        }, {
            path: 'detail/candidate/:id',
            component: TestCandidateDetailComponent
        }, {
            path: 'sample/detail/candidate/:id',
            component: TestCandidateDetailComponent
        }]
    }
];
