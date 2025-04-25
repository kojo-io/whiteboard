import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MailTemplateComponent} from "./mail-template.component";

const routes: Routes = [
  {
    path: 'mail-template',
    component: MailTemplateComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MailTemplateRoutingModule { }
