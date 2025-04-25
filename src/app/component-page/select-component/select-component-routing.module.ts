import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SelectComponentComponent} from "./select-component.component";

const routes: Routes = [
  {
    path: 'select-component',
    component: SelectComponentComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SelectComponentRoutingModule { }
