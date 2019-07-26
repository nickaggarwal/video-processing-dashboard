import { Routes } from '@angular/router';

import { QuestionsComponent } from './questions.component';
import { QuestionDetailComponent } from './question-detail/question-detail.component';

export const QuestionsRoutes: Routes = [
    {
      path: '',
      children:[{
        path: '',
        component: QuestionsComponent
        }, {
          path: ':tagIds',
          component: QuestionsComponent
        }, {
          path: 'detail/:id',
          component: QuestionDetailComponent
        }
      ]
    }
];
