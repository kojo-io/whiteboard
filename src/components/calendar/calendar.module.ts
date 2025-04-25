import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarMiniComponent } from './calendar-mini/calendar-mini.component';
import {ButtonModule} from "../button/button.module";
import {LabelModule} from "../label/label.module";
import { CalendarRangeComponent } from './calendar-range/calendar-range.component';
import {FormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    CalendarMiniComponent,
    CalendarRangeComponent
  ],
  exports: [
    CalendarMiniComponent,
    CalendarRangeComponent
  ],
  imports: [
    CommonModule,
    ButtonModule,
    LabelModule,
    FormsModule
  ]
})
export class CalendarModule { }
