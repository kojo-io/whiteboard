import {Component, forwardRef, Input, OnInit, TemplateRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {ComponentService} from "../../component.service";

@Component({
  selector: 'sc-input',
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => TextInputComponent),
    }
  ]
})
export class TextInputComponent implements OnInit, ControlValueAccessor {
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() model: string = '';
  @Input() required: boolean = false;
  @Input() name: string = '';
  @Input() readOnly: boolean = false;
  @Input() size: 'normal' | 'large' | undefined = 'normal'
  @Input() inputGroup: ''| undefined = undefined;
  @Input() groupPosition: 'prefix' | 'suffix' | 'both' = 'prefix';
  @Input() suffixTemplate?: TemplateRef<any>;
  @Input() prefixTemplate?: TemplateRef<any>;
  @Input() disabled = false;
  @Input() invalid: boolean = false;
  @Input() touched: boolean = false;
  focused: boolean = false;

  context: any;
  onChange = (_: any) => {};
  onTouched = (_?: any) => {
    this.touched = true;
  };
  id = ComponentService.uuid();

  ngOnInit(): void {

  }

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: (_: any) => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(obj: any): void {
    this.model = obj;
  }

  updateForm(value: any) {
    this.model = value;
    this.checkInvalid();
    this.onChange(value);
  }

  checkInvalid() {
    this.invalid = this.required && !this.model;
  }

  // Method to handle focus event
  onFocus() {
    this.focused = true;
  }

  // Method to handle blur event
  onBlur() {
    this.focused = false;
    this.onTouched();  // Also mark as touched
  }
}
