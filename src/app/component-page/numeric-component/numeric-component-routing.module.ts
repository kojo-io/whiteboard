import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {NumericComponentComponent} from "./numeric-component.component";

const routes: Routes = [
  {
    path: 'numeric-component',
    component: NumericComponentComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NumericComponentRoutingModule { }
