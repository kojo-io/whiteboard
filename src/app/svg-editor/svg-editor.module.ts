import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SvgEditorRoutingModule } from './svg-editor-routing.module';
import { SvgEditorComponent } from './svg-editor.component';
import {FormsModule} from "@angular/forms";
import {InputModule} from "../../components/input/input.module";


@NgModule({
  declarations: [
    SvgEditorComponent
  ],
    imports: [
        CommonModule,
        SvgEditorRoutingModule,
        FormsModule,
        InputModule
    ]
})
export class SvgEditorModule { }
