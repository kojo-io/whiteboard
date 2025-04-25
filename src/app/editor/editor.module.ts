import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditorRoutingModule } from './editor-routing.module';
import { EditorComponent } from './editor.component';
import {FormsModule} from "@angular/forms";
import {InputModule} from "../../components/input/input.module";
import {SelectModule} from "../../components/select/select.module";
import {TabModule} from "../../components/tab/tab.module";
import {LabelModule} from "../../components/label/label.module";
import {ButtonModule} from "../../components/button/button.module";
import {CheckBoxModule} from "../../components/check-box/check-box.module";


@NgModule({
    declarations: [
        EditorComponent
    ],
    exports: [
        EditorComponent
    ],
    imports: [
        CommonModule,
        EditorRoutingModule,
        FormsModule,
        InputModule,
        SelectModule,
        TabModule,
        LabelModule,
        ButtonModule,
        CheckBoxModule
    ]
})
export class EditorModule { }
