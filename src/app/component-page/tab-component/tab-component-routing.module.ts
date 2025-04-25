import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TabComponentComponent} from "./tab-component.component";

const routes: Routes = [
  {
    path: 'tab-component',
    component: TabComponentComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabComponentRoutingModule { }
