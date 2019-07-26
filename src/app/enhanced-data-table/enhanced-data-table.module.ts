import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnhancedDataTableComponent } from './enhanced-data-table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'app/app.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
  ],
  declarations: [
    EnhancedDataTableComponent
  ],
  exports: [
    EnhancedDataTableComponent
  ]
})
export class EnhancedDataTableModule { }
