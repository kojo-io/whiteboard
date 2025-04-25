import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TableComponentComponent} from "./table-component.component";

const routes: Routes = [
  {
    path: 'table-component',
    component: TableComponentComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TableComponentRoutingModule { }
