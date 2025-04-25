import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectComponent } from './select.component';
import {FormsModule} from "@angular/forms";
import {DirectivesModule} from "../directives/directives.module";
import { SelectSearchComponent } from './select-search/select-search.component';
import {InputModule} from "../input/input.module";
import { SelectOptionComponent } from './select-option/select-option.component';



@NgModule({
  declarations: [
    SelectComponent,
    SelectSearchComponent,
    SelectOptionComponent
  ],
  exports: [
    SelectComponent,
    SelectSearchComponent,
    SelectOptionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    DirectivesModule,
    InputModule
  ]
})
export class SelectModule { }
