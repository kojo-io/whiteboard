import {Component, inject} from '@angular/core';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {Placeholder} from "./models/placeholder";

@Component({
  selector: 'app-mail-template',
  templateUrl: './mail-template.component.html',
  styleUrls: ['./mail-template.component.css']
})
export class MailTemplateComponent {
  htmlInput: string = '';
  previewHtml: SafeHtml = '';
  placeholders: Placeholder[] = [];
  showPlaceholdersSection: boolean = false;

  sanitizer = inject(DomSanitizer)

  updatePreview() {
    this.extractPlaceholders();
    const processedHtml = this.applyReplacements(this.htmlInput);
    this.previewHtml = this.sanitizer.bypassSecurityTrustHtml(processedHtml);
  }

  extractPlaceholders() {
    const styleTags = this.htmlInput.match(/<style[^>]*>([\s\S]*?)<\/style>/g) || [];
    const nonStyleContent = this.htmlInput.replace(/<style[^>]*>[\s\S]*?<\/style>/g, '');

    // Find placeholders in regular content
    const contentPlaceholders = this.findPlaceholdersInText(nonStyleContent)
      .map(name => this.createPlaceholder(name, false));

    // Find placeholders in style tags
    const stylePlaceholders = this.findPlaceholdersInStyles(styleTags)
      .map(name => this.createPlaceholder(name, true));

    // Merge and deduplicate
    const allPlaceholders = [...contentPlaceholders, ...stylePlaceholders];
    const uniqueNames = [...new Set(allPlaceholders.map(p => p.name))];

    this.placeholders = uniqueNames.map(name => {
      const existing = this.placeholders.find(p => p.name === name);
      const newPlaceholder = allPlaceholders.find(p => p.name === name) ||
        this.createPlaceholder(name, false);

      return {
        ...newPlaceholder,
        currentValue: existing?.currentValue || newPlaceholder.defaultValue
      };
    });

    this.showPlaceholdersSection = this.placeholders.length > 0;
  }

  createPlaceholder(name: string, isCssValue: boolean): Placeholder {
    const isColor = name.toLowerCase().includes('color') ||
      name.toLowerCase().includes('colour') ||
      (isCssValue && !name.match(/^(width|height|size|margin|padding)$/i));

    const isDate = name.toLowerCase().includes('date') ||
      name.toLowerCase().includes('time');

    return {
      name,
      type: isColor ? 'color' : isDate ? 'date' : 'text',
      defaultValue: isColor ? '#ffffff' : isDate ? new Date().toISOString().split('T')[0] : '',
      currentValue: '',
      isCssValue,
      description: this.extractDescription(name)
    };
  }

  extractDescription(name: string): string {
    const commentMatch = this.htmlInput.match(new RegExp(`<!--\\s*${name}:([^>]+)-->`));
    return commentMatch ? commentMatch[1].trim() : '';
  }

  findPlaceholdersInText(text: string): string[] {
    const regex = /{([^{}\s]+)}/g;
    const matches = text.match(regex) || [];
    return matches.map(match => match.slice(1, -1).trim()).filter(p => p.length > 0);
  }

  findPlaceholdersInStyles(styleTags: string[]): string[] {
    const placeholders: string[] = [];
    const valueRegex = /[:{]\s*([#\{]([^{}#\s]+)[}#])/g;

    styleTags.forEach(styleTag => {
      let match;
      while ((match = valueRegex.exec(styleTag)) !== null) {
        if (match[2] && !match[2].startsWith('#') && !placeholders.includes(match[2])) {
          placeholders.push(match[2]);
        }
      }
    });

    return placeholders;
  }

  applyReplacements(html: string): string {
    let result = html;
    this.placeholders.forEach(placeholder => {
      // Replace {Placeholder} in HTML
      result = result.replace(
        new RegExp(`{${placeholder.name}}`, 'g'),
        placeholder.currentValue
      );

      // Replace #Placeholder in CSS
      if (placeholder.isCssValue) {
        result = result.replace(
          new RegExp(`#${placeholder.name}`, 'g'),
          placeholder.currentValue
        );
      }
    });
    return result;
  }

  handlePaste(value : string) {
    this.htmlInput = value;
    this.updatePreview();
  }
}
