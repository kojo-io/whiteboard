import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ComponentPageComponent} from "./component-page.component";

const routes: Routes = [
  {
    path: 'components',
    component: ComponentPageComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./tab-component/tab-component.module').then(m => m.TabComponentModule)
      },
      {
        path: '',
        loadChildren: () => import('./input-component/input-component.module').then(m => m.InputComponentModule)
      },
      {
        path: '',
        loadChildren: () => import('./numeric-component/numeric-component.module').then(m => m.NumericComponentModule)
      },
      {
        path: '',
        loadChildren: () => import('./button-component/button-component.module').then(m => m.ButtonComponentModule)
      },
      {
        path: '',
        loadChildren: () => import('./select-component/select-component.module').then(m => m.SelectComponentModule)
      },
      {
        path: '',
        loadChildren: () => import('./paginate-component/paginate-component.module').then(m => m.PaginateComponentModule)
      },
      {
        path: '',
        loadChildren: () => import('./table-component/table-component.module').then(m => m.TableComponentModule)
      },
      {
        path: '',
        loadChildren: () => import('./date-component/date-component.module').then(m => m.DateComponentModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentPageRoutingModule { }
