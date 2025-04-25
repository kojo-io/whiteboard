import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MailTemplateRoutingModule } from './mail-template-routing.module';
import { MailTemplateComponent } from './mail-template.component';
import {FormsModule} from "@angular/forms";
import { MailEditorComponent } from './editor/mail-editor.component';


@NgModule({
  declarations: [
    MailTemplateComponent,
    MailEditorComponent
  ],
  imports: [
    CommonModule,
    MailTemplateRoutingModule,
    FormsModule,
  ]
})
export class MailTemplateModule { }
