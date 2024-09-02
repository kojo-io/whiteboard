import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SvgEditorRoutingModule } from './svg-editor-routing.module';
import { SvgEditorComponent } from './svg-editor.component';
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    SvgEditorComponent
  ],
  imports: [
    CommonModule,
    SvgEditorRoutingModule,
    FormsModule
  ]
})
export class SvgEditorModule { }
