import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckBoxComponent } from './check-box.component';
import {FormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    CheckBoxComponent
  ],
  exports: [
    CheckBoxComponent
  ],
    imports: [
        CommonModule,
        FormsModule
    ]
})
export class CheckBoxModule { }
