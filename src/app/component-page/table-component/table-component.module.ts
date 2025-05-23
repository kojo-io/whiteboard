import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableComponentRoutingModule } from './table-component-routing.module';
import { TableComponentComponent } from './table-component.component';
import {LabelModule} from "../../../components/label/label.module";
import {SelectModule} from "../../../components/select/select.module";
import {TableModule} from "../../../components/table/table.module";
import {PaginationModule} from "../../../components/pagination/pagination.module";


@NgModule({
  declarations: [
    TableComponentComponent
  ],
    imports: [
        CommonModule,
        TableComponentRoutingModule,
        LabelModule,
        SelectModule,
        TableModule,
        PaginationModule
    ]
})
export class TableComponentModule { }
