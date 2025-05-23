import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FabricjsPageRoutingModule } from './fabricjs-page-routing.module';
import { FabricjsPageComponent } from './fabricjs-page.component';


@NgModule({
  declarations: [
    FabricjsPageComponent
  ],
  imports: [
    CommonModule,
    FabricjsPageRoutingModule
  ]
})
export class FabricjsPageModule { }
