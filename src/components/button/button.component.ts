import {Component, Host, Input, TemplateRef} from '@angular/core';

@Component({
  selector: 'sc-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  @Host() class = '';
  @Input() suffixIcon?: TemplateRef<any>;
  @Input() prefixIcon?: TemplateRef<any>;
  @Input() variant: 'primary' | 'secondary' | 'light' | 'ghost' | 'destructive' = 'primary';
  @Input() block: '' | undefined = undefined;
  @Input() loading = false;
  @Input() disabled = false;
  context: any;
}
