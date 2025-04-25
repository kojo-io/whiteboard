import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InputComponentRoutingModule } from './input-component-routing.module';
import { InputComponentComponent } from './input-component.component';
import {TabModule} from "../../../components/tab/tab.module";
import {InputModule} from "../../../components/input/input.module";
import {LabelModule} from "../../../components/label/label.module";
import {ButtonModule} from "../../../components/button/button.module";
import {SelectModule} from "../../../components/select/select.module";
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    InputComponentComponent
  ],
    imports: [
        CommonModule,
        InputComponentRoutingModule,
        TabModule,
        InputModule,
        LabelModule,
        ButtonModule,
        SelectModule,
        FormsModule
    ]
})
export class InputComponentModule { }
