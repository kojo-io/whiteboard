import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TrDirective} from "./directives/tc-tr.directive";
import {TableDirective} from "./directives/tc-table.directive";
import {TdDirective} from "./directives/tc-td.directive";
import {ThDirective} from "./directives/tc-th.directive";
import {TheadDirective} from "./directives/tc-thead.directive";
import {TableComponent} from "./table.component";
import {PaginationModule} from "../pagination/pagination.module";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    TableComponent,
    TrDirective,
    TableDirective,
    TdDirective,
    ThDirective,
    TheadDirective
  ],
  exports: [
    TableComponent,
    TheadDirective,
    ThDirective,
    TrDirective,
    TdDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    PaginationModule
  ]
})

export class TableModule { }
