import {Component, OnInit} from '@angular/core';
import {FormTemplate} from "./types/form-template";
import {ComponentService} from "../../components/component.service";
import {TabItem} from "../../components/tab/types/tab-item";

@Component({
  selector: 'app-dynamic-forms',
  templateUrl: './dynamic-forms.component.html',
  styleUrl: './dynamic-forms.component.css'
})
export class DynamicFormsComponent implements OnInit {
  form: FormTemplate = {
    name: 'Form',
    questions: []
  }

  tabItems: TabItem[] = [
    {
      title: 'Design',
    },
    {
      title: 'Preview Window',
    },
    {
      title: 'Preview Code Window',
    }
  ]

  addShortText() {
    this.form.questions.push({
      question: 'Label',
      description: 'Description',
      required: false,
      responseType: 'SHORT TEXT',
      id: ComponentService.uuid()
    })
  }

  addNumber() {
    this.form.questions.push({
      question: 'Label',
      description: 'Description',
      required: false,
      responseType: 'NUMBER',
      id: ComponentService.uuid()
    })
  }

  ngOnInit(): void {
  }
}
