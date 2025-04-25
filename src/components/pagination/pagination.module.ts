import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from './pagination.component';
import {SelectModule} from "../select/select.module";
import {FormsModule} from "@angular/forms";
import {LabelModule} from "../label/label.module";


@NgModule({
    declarations: [
        PaginationComponent
    ],
    exports: [
        PaginationComponent
    ],
  imports: [
    CommonModule,
    SelectModule,
    FormsModule,
    LabelModule
  ]
})
export class PaginationModule { }
