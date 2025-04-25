import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DropDownDirective} from "./drop-down.directive";
import { TooltipDirective } from './tooltip.directive';
import {DropDownItemDirective} from "./drop-down-item.directive";



@NgModule({
  declarations: [
    DropDownDirective,
    TooltipDirective,
    DropDownItemDirective
  ],
  exports: [
    DropDownDirective,
    TooltipDirective,
    DropDownItemDirective
  ],
  imports: [
    CommonModule
  ]
})
export class DirectivesModule { }
