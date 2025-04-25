import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ButtonComponentComponent} from "./button-component.component";

const routes: Routes = [
  {
    path: 'button-component',
    component: ButtonComponentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ButtonComponentRoutingModule { }
