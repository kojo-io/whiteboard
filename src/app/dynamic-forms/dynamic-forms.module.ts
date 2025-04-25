import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicFormsRoutingModule } from './dynamic-forms-routing.module';
import { DynamicFormsComponent } from './dynamic-forms.component';
import {InputModule} from "../../components/input/input.module";
import {TabModule} from "../../components/tab/tab.module";


@NgModule({
  declarations: [
    DynamicFormsComponent
  ],
  imports: [
    CommonModule,
    DynamicFormsRoutingModule,
    InputModule,
    TabModule
  ]
})
export class DynamicFormsModule { }
