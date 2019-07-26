import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../app.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { RegisterComponent } from './register/register.component';
import { AuthRoutes } from 'app/auth/auth.routing';
import { EnterpriseModule } from '../enterprise/enterprise.module';
import { UserVerificationComponent } from './user-verification/user-verification.component';
import { LoginComponent } from './login/login.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { ResendVerificationEmailComponent } from './resend-verification-email/resend-verification-email.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { FooterModule } from 'app/shared/footer/footer.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AuthRoutes),
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    EnterpriseModule,
    FooterModule
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    UserVerificationComponent,
    ConfirmEmailComponent,
    ResendVerificationEmailComponent,
    ForgotPasswordComponent,
    ChangePasswordComponent
  ]
})

export class AuthModule {}
