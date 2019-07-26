import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedbackWidgetComponent } from './feedback-widget.component';
import { MaterialModule } from 'app/app.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppRoutes } from 'app/app.routing';
import { MdModule } from 'app/md/md.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MdModule
  ],
  declarations: [FeedbackWidgetComponent]
})
export class FeedbackWidgetModule { }
