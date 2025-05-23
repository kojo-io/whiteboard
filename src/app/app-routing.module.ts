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
        loadChildren: () => import('./dynamic-forms/dynamic-forms.module').then(m => m.DynamicFormsModule)
      },
      {
        path: '',
        loadChildren: () => import('./component-page/component-page.module').then(m => m.ComponentPageModule)
      },
      {
        path: '',
        loadChildren: () => import('./editor/editor.module').then(m => m.EditorModule)
      },
      {
        path: '',
        loadChildren: () => import('./mail-template/mail-template.module').then(m => m.MailTemplateModule)
      },
      {
        path: '',
        loadChildren: () => import('./fabricjs-page/fabricjs-page.module').then(m => m.FabricjsPageModule)
      },
      {
        path: '',
        loadChildren: () => import('./component-generator/component-generator.module').then(m => m.ComponentGeneratorModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
