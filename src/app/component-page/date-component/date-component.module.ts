import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DateComponentRoutingModule } from './date-component-routing.module';
import { DateComponentComponent } from './date-component.component';
import {FormsModule} from "@angular/forms";
import {InputModule} from "../../../components/input/input.module";
import {SelectModule} from "../../../components/select/select.module";
import {CalendarModule} from "../../../components/calendar/calendar.module";
import {LabelModule} from "../../../components/label/label.module";
import {DatePickerModule} from "../../../components/date-picker/date-picker.module";


@NgModule({
  declarations: [
    DateComponentComponent
  ],
    imports: [
        CommonModule,
        DateComponentRoutingModule,
        FormsModule,
        InputModule,
        SelectModule,
        CalendarModule,
        LabelModule,
        DatePickerModule
    ]
})
export class DateComponentModule { }
