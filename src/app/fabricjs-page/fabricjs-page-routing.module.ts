import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FabricjsPageComponent} from "./fabricjs-page.component";

const routes: Routes = [ {
  path: 'fabricjs-board',
  component: FabricjsPageComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FabricjsPageRoutingModule { }
