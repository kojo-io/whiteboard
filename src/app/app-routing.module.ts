import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AppComponent} from "./app.component";

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
      },
      {
        path: '',
        loadChildren: () => import('./svg-editor/svg-editor.module').then(m => m.SvgEditorModule)
      },
      {
        path: '',
        loadChildren: () => import('./canvas-editor/canvas-editor.module').then(m => m.CanvasEditorModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
