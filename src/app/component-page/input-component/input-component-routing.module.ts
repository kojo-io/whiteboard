import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {InputComponentComponent} from "./input-component.component";

const routes: Routes = [
  {
    path: 'input-component',
    component: InputComponentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InputComponentRoutingModule { }
