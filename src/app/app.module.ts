import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ModalService} from "../components/modal/modal.service";
import {NotificationModule} from "../components/notification/notification.module";
import {NotificationService} from "../components/notification/notification.service";
import {DrawerService} from "../components/drawer/drawer.service";
import {RadioButtonService} from "../components/radio/radio-button.service";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NotificationModule,
  ],
  providers: [
    ModalService,
    DrawerService,
    NotificationService,
    RadioButtonService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
