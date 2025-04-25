import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiSelectComponent } from './multi-select.component';
import {DirectivesModule} from "../directives/directives.module";
import { MultiSelectOptionComponent } from './multi-select-option/multi-select-option.component';



@NgModule({
  declarations: [
    MultiSelectComponent,
    MultiSelectOptionComponent
  ],
  exports: [
    MultiSelectComponent,
    MultiSelectOptionComponent
  ],
  imports: [
    CommonModule,
    DirectivesModule
  ]
})
export class MultiSelectModule { }
