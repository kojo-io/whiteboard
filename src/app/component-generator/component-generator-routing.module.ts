import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ComponentGeneratorComponent} from "./component-generator.component";

const routes: Routes = [
  {
    path: 'component-generator',
    component: ComponentGeneratorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentGeneratorRoutingModule { }
