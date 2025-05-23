import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentGeneratorRoutingModule } from './component-generator-routing.module';
import { ComponentGeneratorComponent } from './component-generator.component';
import {AccordionModule} from "../../components/accordion/accordion.module";


@NgModule({
  declarations: [
    ComponentGeneratorComponent
  ],
  imports: [
    CommonModule,
    ComponentGeneratorRoutingModule,
    AccordionModule
  ]
})
export class ComponentGeneratorModule { }
