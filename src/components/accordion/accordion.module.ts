import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionComponent } from './accordion.component';
import { AccordionTitleComponent } from './accordion-title/accordion-title.component';



@NgModule({
  declarations: [
    AccordionComponent,
    AccordionTitleComponent
  ],
  exports: [
    AccordionComponent,
    AccordionTitleComponent
  ],
  imports: [
    CommonModule
  ]
})
export class AccordionModule { }
