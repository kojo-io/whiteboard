import {Component, inject, Input, OnChanges, SimpleChanges} from '@angular/core';
import {TailwindClassService} from "./tailwind-class.service";
import {SelectedComponent} from "./selected-component.model";

@Component({
  selector: 'app-component-generator',
  templateUrl: './component-generator.component.html',
  styleUrl: './component-generator.component.css'
})
export class ComponentGeneratorComponent{
  selectedElement = 'button';
  appliedClasses: string[] = [];
  htmlCode = '<button class="btn">Button</button>';

  tw = inject(TailwindClassService);

  toggleClass(cls: string) {
    if (this.appliedClasses.includes(cls)) {
      this.appliedClasses = this.appliedClasses.filter(c => c !== cls);
    } else {
      this.appliedClasses.push(cls);
    }
    this.updateHtmlCode();
  }

  updateHtmlCode() {
    this.htmlCode = `<${this.selectedElement} class="${this.appliedClasses.join(' ')}">Sample</${this.selectedElement}>`;
  }

  reset() {
    this.appliedClasses = [];
    this.updateHtmlCode();
  }
}
