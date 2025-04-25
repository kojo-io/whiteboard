import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DynamicFormsComponent} from "./dynamic-forms.component";

const routes: Routes = [
  {
    path: 'forms',
    component: DynamicFormsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DynamicFormsRoutingModule { }
