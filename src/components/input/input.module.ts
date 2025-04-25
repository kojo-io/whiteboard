import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextInputComponent } from './text-input/text-input.component';
import {FormsModule} from "@angular/forms";
import { NumberInputComponent } from './number-input/number-input.component';
import { TextAreaComponent } from './text-area/text-area.component';
import { PhoneNumberInputComponent } from './phone-number-input/phone-number-input.component';
import {DirectivesModule} from "../directives/directives.module";

@NgModule({
    declarations: [
        TextInputComponent,
        NumberInputComponent,
        TextAreaComponent,
        PhoneNumberInputComponent
    ],
  exports: [
    TextInputComponent,
    NumberInputComponent,
    TextAreaComponent,
    PhoneNumberInputComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    DirectivesModule
  ]
})
export class InputModule { }
