import { Component, ElementRef, forwardRef, Input, OnInit, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {ComponentService} from "../../component.service";
import {format} from "date-fns";

@Component({
  selector: 'sc-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrl: './date-range-picker.component.css',
  host: {
    'class': 'relative'
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => DateRangePickerComponent),
    }
  ]
})
export class DateRangePickerComponent implements OnInit, ControlValueAccessor {

  @ViewChild('dateInput') selectInput!: ElementRef<HTMLInputElement>;
  @Input() placeholder: string = 'Select date range';
  @Input() type: string = 'text';
  @Input() model: string = '';
  @Input() required: boolean = false;
  @Input() name: string = '';
  @Input() readOnly: boolean = true;
  @Input() disabled = false;
  @Input() invalid: boolean = false;
  @Input() touched: boolean = false;
  @Input() showArrow: boolean = false;
  @Input() dateFormat: string = 'MM/dd/yyyy'; // Default format; can be customized
  focused: boolean = false;
  selectedDate: {startDate: Date | null, endDate: Date | null} = {startDate: null, endDate: null};
  errorMessage: string | null = null;

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

  writeValue(data: {startDate: Date | null, endDate: Date | null}): void {
    if (data) {
      this.selectedDate = data;
      if (!data.endDate && !data.startDate) {
        this.model = '';
        return;
      }
      this.model = `${data.startDate ? format(data.startDate, 'dd MMM, yyyy') : ''} - ${data.endDate ? format(data.endDate, 'dd MMM, yyyy') : ''}`;
    }
  }

  onFocus() {
    this.focused = true;
  }

  onBlur() {
    this.focused = false;
    this.onTouched();
  }

  calendarIconClick() {
    this.selectInput.nativeElement.focus();
  }

  dateSelectChange(data: {startDate: Date | null, endDate: Date | null}): void {
    this.selectedDate = data;
    if (!data.endDate && !data.startDate) {
      this.model = '';
      return;
    }
    this.model = `${data.startDate ? format(data.startDate, 'dd MMM, yyyy - ') : ''}${data.endDate ? format(data.endDate, 'dd MMM, yyyy') : ''}`;
  }

  applyChange() {
    this.onChange(this.selectedDate);
  }

  cancelChange() {
    this.selectedDate = {startDate: null, endDate: null};
    this.model = '';
    this.onChange(this.selectedDate);
  }
}
