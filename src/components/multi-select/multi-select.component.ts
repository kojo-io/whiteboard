import {Component, forwardRef, inject, Input, OnInit, TemplateRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {MultiSelectService} from "./multi-select.service";
import {ComponentService} from "../component.service";

@Component({
  selector: 'sc-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrl: './multi-select.component.css',
  providers: [
    MultiSelectService,
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => MultiSelectComponent),
    }
  ]
})
export class MultiSelectComponent implements OnInit, ControlValueAccessor {
  @Input() allowClear: boolean = false;
  @Input() placeholder: string = '';
  selectedItems: {label: any; value: any}[] = [];
  @Input() data: {label: any; value: any}[] = [];
  @Input() required: boolean = false;
  @Input() name: string = '';
  @Input() readOnly: boolean = false;
  @Input() disabled = false;
  @Input() invalid: boolean = false;
  @Input() touched: boolean = false;
  @Input() template: boolean = false;
  @Input() suffixTemplate?: TemplateRef<any>;
  @Input() prefixTemplate?: TemplateRef<any>;

  context: any;
  focused: boolean = false;
  service = inject(MultiSelectService);

  onChange = (_: any) => {};

  onTouched = (_?: any) => {
    this.touched = true;
  };
  id = ComponentService.uuid();
  ngOnInit(): void {
    if (this.data.length > 0) {
      this.selectedItems = [...this.data];
    }
    this.service.selected
      .subscribe({
        next: (value: {value: any, label: any}) => {
          if (value) {
            if (!this.selectedItems.find(u => u.value === value.value)) {
              this.selectedItems.push({label: value.label, value: value.value});
              this.onChange(this.selectedItems.map(u => u.value));
            }
          }
        }
      });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(obj: any): void {
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

  clearSelected(): void {
    if (this.readOnly || this.disabled) {
      return;
    }
    this.selectedItems = [];
    this.onChange(this.selectedItems.map(u => u.value));
  }

  removeItem(index: number): void {
    this.selectedItems.splice(index, 1);
    this.onChange(this.selectedItems.map(u => u.value));
  }
}
