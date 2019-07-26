import { Routes } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { UserVerificationComponent } from './user-verification/user-verification.component';
import { LoginComponent } from './login/login.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { ResendVerificationEmailComponent } from './resend-verification-email/resend-verification-email.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

export const AuthRoutes: Routes = [

    {
        path: '',
        children: [ {
            path: 'login',
            component: LoginComponent
        }, {
            path: 'register',
            component: RegisterComponent
        }, {
            path: 'confirm-email',
            component: ConfirmEmailComponent
        }, {
            path: 'verification',
            component: UserVerificationComponent
        }, {
            path: 'resend-verification-email',
            component: ResendVerificationEmailComponent
        }, {
            path: 'forgot-password',
            component: ForgotPasswordComponent
        }, {
            path: 'change-password',
            component: ChangePasswordComponent
        }]
    }
];
