import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndeterminateProgressBarComponent } from './indeterminate-progress-bar.component';



@NgModule({
  declarations: [
    IndeterminateProgressBarComponent
  ],
  exports: [
    IndeterminateProgressBarComponent
  ],
  imports: [
    CommonModule
  ]
})
export class IndeterminateProgressBarModule { }
