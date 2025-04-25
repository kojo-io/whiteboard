import {Component, ElementRef, forwardRef, inject, Input, OnInit, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import { ComponentService } from "../../component.service";
import {format, isDate, isValid, parse} from "date-fns";

@Component({
  selector: 'sc-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => DatePickerComponent),
    }
  ]
})
export class DatePickerComponent implements OnInit, ControlValueAccessor {

  @ViewChild('dateInput') selectInput!: ElementRef<HTMLInputElement>;
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() model: string = '';
  @Input() required: boolean = false;
  @Input() name: string = '';
  @Input() readOnly: boolean = false;
  @Input() disabled = false;
  @Input() invalid: boolean = false;
  @Input() touched: boolean = false;
  @Input() showArrow: boolean = false;
  @Input() mode : 'date' | 'month' | 'year' = 'year';
  @Input() dateFormat: string = 'MM/dd/yyyy'; // Default format; can be customized
  focused: boolean = false;
  selectedDate: Date = new Date();
  errorMessage: string | null = null;

  onChange = (_: any) => {};
  onTouched = (_?: any) => {
    this.touched = true;
  };
  id = ComponentService.uuid();

  ngOnInit(): void {
    if(this.mode == 'month') {
      this.dateFormat = 'MMMM yyyy';
    }
    if(this.mode == 'year') {
      this.dateFormat = 'yyyy';
    }
    this.model = format(this.selectedDate, this.dateFormat);
    this.onChange(this.selectedDate);
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

  writeValue(obj: Date): void {
    if (obj) {
      this.model = format(obj, this.dateFormat); // Pass the date value for formatting
    }
  }

  onFocus() {
    this.focused = true;
  }

  onBlur() {
    this.focused = false;
    this.onTouched();
  }

  checkValue(value: string): void {
    this.touched = true
    // Reset the error message
    this.errorMessage = null;

    const date = parse(value, this.dateFormat, new Date());
    const dateValue = isValid(date);
    // Check if the value is less than min, only if min is defined
    if (!dateValue) {
      this.errorMessage = `Invalid date value.`;
      this.invalid = true;
      return;
    }
    this.selectedDate = date;

    // If no error message, the value is valid within the range
    if (!this.errorMessage) {
      this.invalid = false;
      this.onChange(this.selectedDate);
    }
  }

  calendarIconClick() {
    this.selectInput.nativeElement.focus();
  }

  dateSelectChange(calendar: HTMLElement): void {
    calendar.click();
    this.model = format(this.selectedDate, this.dateFormat);
    this.onChange(this.selectedDate);
  }
}
