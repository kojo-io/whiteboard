import {Component, forwardRef, Input, model, OnInit, TemplateRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {ComponentService} from "../../component.service";

@Component({
  selector: 'sc-number-input',
  templateUrl: './number-input.component.html',
  styleUrl: './number-input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => NumberInputComponent),
    }
  ]
})
export class NumberInputComponent implements OnInit, ControlValueAccessor {
  @Input() placeholder: string = '';
  type: string = 'number';
  @Input() model: number = 0;
  @Input() max: number | undefined = undefined;
  @Input() min: number | undefined = undefined;
  @Input() required: boolean = false;
  @Input() name: string = '';
  @Input() readOnly: boolean = false;
  @Input() size: 'normal' | 'large' | undefined = 'normal'
  @Input() prefixTemplate?: TemplateRef<any>;
  @Input() disabled = false;
  @Input() invalid: boolean = false;
  @Input() touched: boolean = false;
  focused: boolean = false;
  errorMessage: string | null = null;

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

  increment() {
    this.model ++;
    this.checkValue(this.model);
  }

  decrement() {
    this.model --;
    this.checkValue(this.model);
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

  checkValue(value: number): void {
    this.touched = true
    // Reset the error message
    this.errorMessage = null;

    // Check if the value is less than min, only if min is defined
    if (this.min !== undefined && value < this.min) {
      this.errorMessage = `Value should not be less than ${this.min}.`;
      this.invalid = true;
    }

    // Check if the value is greater than max, only if max is defined
    if (this.max !== undefined && value > this.max) {
      this.errorMessage = `Value should not be greater than ${this.max}.`;
      this.invalid = true;
    }

    // If no error message, the value is valid within the range
    if (!this.errorMessage) {
      this.invalid = false;
      this.onChange(value);
    }
  }
}
