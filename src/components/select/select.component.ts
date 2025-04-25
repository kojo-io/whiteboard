import {
  Component,
  forwardRef,
  inject,
  Input,
  OnInit,
  TemplateRef,
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {ComponentService} from "../component.service";
import {SelectService} from "./select.service";

@Component({
  selector: 'sc-select',
  templateUrl: './select.component.html',
  styleUrl: './select.component.css',
  providers: [
    SelectService,
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => SelectComponent),
    }
  ]
})
export class SelectComponent implements OnInit, ControlValueAccessor{
  @Input() allowClear: boolean = false;
  @Input() placeholder: string = '';
  selected: boolean = false;
  @Input() required: boolean = false;
  @Input() name: string = '';
  @Input() readOnly: boolean = false;
  @Input() disabled = false;
  @Input() invalid: boolean = false;
  @Input() touched: boolean = false;
  @Input() template: boolean = false;
  @Input() displayTemplate?: TemplateRef<any>;
  @Input() suffixTemplate?: TemplateRef<any>;
  @Input() prefixTemplate?: TemplateRef<any>;
  context: any;

  displayLabel = '';
  displayValue: any;
  focused: boolean = false;
  service = inject(SelectService);

  onChange = (_: any) => {};

  onTouched = (_?: any) => {
    this.touched = true;
  };

  id = ComponentService.uuid();

  ngOnInit(): void {
    this.service.selected
      .subscribe({
        next: (value: {value: any, label: any}) => {
          if (value) {
            this.displayLabel = value.label;
            this.displayValue = value.value;
            this.selected = true;
            this.onChange(value.value);
          }
        }
    });

    //for default value already selected
    this.service.incoming
      .subscribe({
        next: (value: {value: any, label: any}) => {
          if (value) {
            this.displayLabel = value.label;
            this.displayValue = value.value;
            this.selected = true;
          }
        }
      });

    if (this.template) {
      this.service.templateMode.next(this.template);
    }
  }

  clearSelected(): void {
    if (this.readOnly || this.disabled) {
      return;
    }
    this.service.selected.next({value: null, label: ''});
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(obj: any): void {
    // console.log(obj)
  }

  // Method to handle focus event
  onFocus() {
    this.focused = !this.focused;
  }

  // Method to handle blur event
  onBlur() {
    this.focused = false;
    this.onTouched();  // Also mark as touched
  }
}
