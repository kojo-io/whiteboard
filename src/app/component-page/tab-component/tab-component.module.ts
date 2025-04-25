import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabComponentRoutingModule } from './tab-component-routing.module';
import { TabComponentComponent } from './tab-component.component';
import {TabModule} from "../../../components/tab/tab.module";
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    TabComponentComponent
  ],
    imports: [
        CommonModule,
        TabComponentRoutingModule,
        TabModule,
        FormsModule
    ]
})
export class TabComponentModule { }
