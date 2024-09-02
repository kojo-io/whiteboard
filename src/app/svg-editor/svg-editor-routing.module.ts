import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SvgEditorComponent} from "./svg-editor.component";

const routes: Routes = [
  {
    path: 'svg-canvas',
    component: SvgEditorComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SvgEditorRoutingModule { }
