import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaginateComponentRoutingModule } from './paginate-component-routing.module';
import { PaginateComponentComponent } from './paginate-component.component';
import {LabelModule} from "../../../components/label/label.module";
import {SelectModule} from "../../../components/select/select.module";
import {PaginationModule} from "../../../components/pagination/pagination.module";
import {
    IndeterminateProgressBarModule
} from "../../../components/indeterminate-progress-bar/indeterminate-progress-bar.module";


@NgModule({
  declarations: [
    PaginateComponentComponent
  ],
    imports: [
        CommonModule,
        PaginateComponentRoutingModule,
        LabelModule,
        SelectModule,
        PaginationModule,
        IndeterminateProgressBarModule
    ]
})
export class PaginateComponentModule { }
