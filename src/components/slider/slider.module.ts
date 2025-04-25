import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderComponent } from './slider.component';
import {FormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    SliderComponent
  ],
  exports: [
    SliderComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class SliderModule { }
