import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../app.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EnterpriseComponent } from './common/enterprise.component';
import { EnterpriseTypeComponent } from './enterprise-type/common/enterprise-type.component';
import { EnterpriseTypeSingleSelectComponent } from './enterprise-type/single-select/single-select.component';
// import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    // RouterModule.forChild(PagesRoutes),
    FormsModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  declarations: [
    EnterpriseComponent,
    EnterpriseTypeComponent,
    EnterpriseTypeSingleSelectComponent
  ],
  exports: [
    EnterpriseTypeSingleSelectComponent
  ]
})

export class EnterpriseModule {}
