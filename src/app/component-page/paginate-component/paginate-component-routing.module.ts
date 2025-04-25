import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PaginateComponentComponent} from "./paginate-component.component";

const routes: Routes = [
  {
    path: 'paginate-component',
    component: PaginateComponentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaginateComponentRoutingModule { }
