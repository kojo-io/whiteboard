import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SelectComponentRoutingModule } from './select-component-routing.module';
import { SelectComponentComponent } from './select-component.component';
import {InputModule} from "../../../components/input/input.module";
import {SelectModule} from "../../../components/select/select.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {LabelModule} from "../../../components/label/label.module";
import {ToggleModule} from "../../../components/toggle/toggle.module";
import {CheckBoxModule} from "../../../components/check-box/check-box.module";
import {RadioModule} from "../../../components/radio/radio.module";
import {MultiSelectModule} from "../../../components/multi-select/multi-select.module";


@NgModule({
  declarations: [
    SelectComponentComponent
  ],
  imports: [
    CommonModule,
    SelectComponentRoutingModule,
    InputModule,
    SelectModule,
    FormsModule,
    ReactiveFormsModule,
    LabelModule,
    ToggleModule,
    CheckBoxModule,
    RadioModule,
    MultiSelectModule,
  ]
})
export class SelectComponentModule { }
