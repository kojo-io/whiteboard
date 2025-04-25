import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonComponentRoutingModule } from './button-component-routing.module';
import { ButtonComponentComponent } from './button-component.component';
import {InputModule} from "../../../components/input/input.module";
import {LabelModule} from "../../../components/label/label.module";
import {ButtonModule} from "../../../components/button/button.module";
import {ModalModule} from "../../../components/modal/modal.module";
import {BadgeModule} from "../../../components/badge/badge.module";
import {DirectivesModule} from "../../../components/directives/directives.module";
import {TabModule} from "../../../components/tab/tab.module";
import {FormsModule} from "@angular/forms";
import {DrawerModule} from "../../../components/drawer/drawer.module";


@NgModule({
  declarations: [
    ButtonComponentComponent
  ],
  imports: [
    CommonModule,
    ButtonComponentRoutingModule,
    InputModule,
    LabelModule,
    ButtonModule,
    ModalModule,
    DrawerModule,
    BadgeModule,
    DirectivesModule,
    TabModule,
    FormsModule
  ]
})
export class ButtonComponentModule { }
