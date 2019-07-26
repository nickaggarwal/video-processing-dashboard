import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { AuthGuardService as AuthGuard } from './user/auth-guard.service';
import { LoginGuardService as LoginGuard } from './auth/login-guard.service';

export const AppRoutes: Routes = [
    {
      path: 'login',
      redirectTo: 'auth/login',
      pathMatch: 'full',
    }, {
      path: '',
      redirectTo: 'index',
      pathMatch: 'full',
    //   canActivate: [AuthGuard] ,
    }, {
      path: '',
      component: AdminLayoutComponent,
    //   canActivate: [AuthGuard] ,
      children: [
          {
                path: '',
                loadChildren: './dashboard/dashboard.module#DashboardModule'
            }, {
                path: 'components',
                loadChildren: './components/components.module#ComponentsModule'
            }, {
                path: 'forms',
                loadChildren: './forms/forms.module#Forms'
            }, {
                path: 'tables',
                loadChildren: './tables/tables.module#TablesModule'
            }, {
                path: 'maps',
                loadChildren: './maps/maps.module#MapsModule'
            }, {
                path: 'widgets',
                loadChildren: './widgets/widgets.module#WidgetsModule'
            }, {
                path: 'charts',
                loadChildren: './charts/charts.module#ChartsModule'
            }, {
                path: 'calendar',
                loadChildren: './calendar/calendar.module#CalendarModule'
            }, {
                path: 'user',
                loadChildren: './userpage/user.module#UserModule'
            }, {
                path: 'timeline',
                loadChildren: './timeline/timeline.module#TimelineModule'
            }, {
                path: 'questions',
                loadChildren: './questions/questions.module#QuestionsModule'
            }, {
                path: 'candidate-tests',
                loadChildren: './tests/tests.module#TestsModule'
            }, {
                path: 'candidates',
                loadChildren: './candidates/candidates.module#CandidatesModule'
            }, {
                path: 'reports',
                loadChildren: './tests/tests.module#TestsModule'
            }, {
                path: 'edit-profile',
                loadChildren: './edit-profile/edit-profile.module#EditProfileModule'
            }
        ]
//   }, {
//       path: '',
//       component: AuthLayoutComponent,
//       canActivate: [LoginGuard] ,
//       children: [{
//         path: 'auth',
//         loadChildren: './auth/auth.module#AuthModule'
//       }]
    }
];
