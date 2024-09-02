import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CanvasEditorComponent} from "./canvas-editor.component";

const routes: Routes = [
  {
    path: 'canvas-editor',
    component: CanvasEditorComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CanvasEditorRoutingModule { }
