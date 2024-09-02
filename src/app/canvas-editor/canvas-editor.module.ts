import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CanvasEditorRoutingModule } from './canvas-editor-routing.module';
import { CanvasEditorComponent } from './canvas-editor.component';
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    CanvasEditorComponent
  ],
  imports: [
    CommonModule,
    CanvasEditorRoutingModule,
    FormsModule
  ]
})
export class CanvasEditorModule { }
