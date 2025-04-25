import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentPageRoutingModule } from './component-page-routing.module';
import { ComponentPageComponent } from './component-page.component';
import {TabModule} from "../../components/tab/tab.module";
import {DirectivesModule} from "../../components/directives/directives.module";
import { TestModalComponent } from './test-modal/test-modal.component';


@NgModule({
  declarations: [
    ComponentPageComponent,
    TestModalComponent
  ],
  imports: [
    CommonModule,
    ComponentPageRoutingModule,
    TabModule,
    DirectivesModule
  ]
})
export class ComponentPageModule { }
