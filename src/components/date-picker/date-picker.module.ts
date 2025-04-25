import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePickerComponent } from './date-picker/date-picker.component';
import {DirectivesModule} from "../directives/directives.module";
import {FormsModule} from "@angular/forms";
import {InputModule} from "../input/input.module";
import {CalendarModule} from "../calendar/calendar.module";
import { DateRangePickerComponent } from './date-range-picker/date-range-picker.component';
import {LabelModule} from "../label/label.module";
import {ButtonModule} from "../button/button.module";



@NgModule({
  declarations: [
    DatePickerComponent,
    DateRangePickerComponent
  ],
  exports: [
    DatePickerComponent,
    DateRangePickerComponent
  ],
  imports: [
    CommonModule,
    DirectivesModule,
    FormsModule,
    InputModule,
    CalendarModule,
    LabelModule,
    ButtonModule
  ]
})
export class DatePickerModule { }
