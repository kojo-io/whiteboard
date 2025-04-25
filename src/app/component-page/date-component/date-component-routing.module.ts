import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DateComponentComponent} from "./date-component.component";

const routes: Routes = [
  {
    path: 'date-component',
    component: DateComponentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DateComponentRoutingModule { }
