import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NumericComponentRoutingModule } from './numeric-component-routing.module';
import { NumericComponentComponent } from './numeric-component.component';
import {InputModule} from "../../../components/input/input.module";
import {LabelModule} from "../../../components/label/label.module";


@NgModule({
  declarations: [
    NumericComponentComponent
  ],
  imports: [
    CommonModule,
    NumericComponentRoutingModule,
    InputModule,
    LabelModule
  ]
})
export class NumericComponentModule { }
