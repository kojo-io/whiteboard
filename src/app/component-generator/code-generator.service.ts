// services/code-generator.service.ts
import { Injectable } from '@angular/core';
import {ComponentConfig} from "./component-config.model";

@Injectable({ providedIn: 'root' })
export class CodeGeneratorService {
  generateFiles(config: ComponentConfig): Record<string, string> {
    const classAttr = config.classList.join(' ');
    const selector = `app-${config.name}`;

    const html = `<div class="${classAttr}">\n  ${config.html || 'Hello ' + config.name}\n</div>`;
    const ts = `import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: '${selector}',
  templateUrl: './${config.name}.component.html',
  styleUrls: ['./${config.name}.component.scss']
})
export class ${this.toClassName(config.name)}Component {
  ${this.inputsToString(config.inputs)}
  ${this.outputsToString(config.outputs)}
}`;

    const scss = config.styles || '';

    return {
      [`${config.name}.component.ts`]: ts,
      [`${config.name}.component.html`]: html,
      [`${config.name}.component.scss`]: scss,
    };
  }

  private toClassName(name: string): string {
    return name
      .split('-')
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join('');
  }

  private inputsToString(inputs?: ComponentConfig['inputs']): string {
    return (inputs || [])
      .map((i) => `@Input() ${i.name}: ${i.type};`)
      .join('\n  ');
  }

  private outputsToString(outputs?: ComponentConfig['outputs']): string {
    return (outputs || [])
      .map((o) => `@Output() ${o.name} = new EventEmitter<any>();`)
      .join('\n  ');
  }
}
