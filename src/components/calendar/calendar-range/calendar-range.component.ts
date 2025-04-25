import {
  Component,
  forwardRef,
  Input,
} from '@angular/core';
import {addMonths, eachDayOfInterval, format, subMonths} from "date-fns";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'sc-calendar-range',
  templateUrl: './calendar-range.component.html',
  styleUrl: './calendar-range.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => CalendarRangeComponent),
    }
  ]
})
export class CalendarRangeComponent implements ControlValueAccessor {
  onChange = (_: any) => {};
  onTouched = (_?: any) => {};
  // @Output() onDateSelect = new EventEmitter<{startDate: Date | null, endDate:Date | null}>();
  @Input() showDivider = false;
  start: Date = new Date();
  end: Date = addMonths(this.start, 1);
  dateArray: Date[] = [];
  selectionStart = false;
  selectionEnd = false;
  selectedDate: {startDate: Date | null, endDate: Date | null} = {startDate: null, endDate: null};
  selectedStart: Date | null = null;
  selectedEnd: Date | null = null;

  getStartDate(date: Date): void {
    // Reset selection if selected date matches current start date
    if (this.selectedStart && format(this.selectedStart, 'MM/dd/yyyy') === format(date, 'MM/dd/yyyy')) {
      this.resetSelection();
      return;
    }

    if (this.selectedEnd && format(this.selectedEnd, 'MM/dd/yyyy') === format(date, 'MM/dd/yyyy')) {
      this.resetSelection();
      return;
    }

    // If start date already exists, assign new date as end date
    if (this.selectedStart) {
      if (date < this.selectedStart) {
        this.selectedStart = date;
        this.end = addMonths(date, 1);
      } else {
        this.selectedEnd = date;
        this.selectionEnd = false;
      }
    } else {
      this.selectedStart = date;
      this.end = addMonths(date, 1);
    }

    // Ensure valid range and update date array
    this.validateAndSetDateArray();
  }

  getEndDate(date: Date): void {
    // Reset selection if selected date matches current end date
    if (this.selectedEnd && format(this.selectedEnd, 'MM/dd/yyyy') === format(date, 'MM/dd/yyyy')) {
      this.resetSelection();
      return;
    }

    if (this.selectedStart && format(this.selectedStart, 'MM/dd/yyyy') === format(date, 'MM/dd/yyyy')) {
      this.resetSelection();
      return;
    }

    // If both dates are null, set the new date as `selectedEnd`
    if (!this.selectedStart && !this.selectedEnd) {
      this.selectedEnd = date;
    } else if (!this.selectedStart) {
      // If only `selectedStart` is null, set the new date as `selectedStart`
      this.selectedStart = date;
      this.selectionStart = false
    } else {
      // If both dates are set, update `selectedEnd` if the new date is greater than or equal to `selectedStart`
      if (date >= this.selectedStart) {
        this.selectedEnd = date;
        this.start = subMonths(date, 1);
      } else {
        this.selectedStart = date;
        this.selectionStart = false
      }
    }

    // Ensure valid range and update date array
    this.validateAndSetDateArray();
  }

  // Resets date selection
  resetSelection(): void {
    this.selectedStart = null;
    this.selectedEnd = null;
    this.selectionStart = false;
    this.selectionEnd = false;
    this.dateArray = [];

    this.onChange({startDate: this.selectedStart, endDate: this.selectedEnd});
  }

  // Validates the date range and sets the date array if both dates are selected
  validateAndSetDateArray(): void {
    if (this.selectedStart && this.selectedEnd) {
      if (this.selectedStart > this.selectedEnd) {
        [this.selectedStart, this.selectedEnd] = [this.selectedEnd, this.selectedStart];
      }
      this.dateArray = eachDayOfInterval({
        start: this.selectedStart,
        end: this.selectedEnd,
      });
    }
    this.onChange({startDate: this.selectedStart, endDate: this.selectedEnd});
  }

  initialize(data: {startDate: Date | null, endDate: Date | null}) {
    // Set initial selectedStart and selectedEnd from input startDate and endDate
    if (data.startDate) {
      this.selectedStart = data.startDate;
      this.start = data.startDate;
      this.end = addMonths(this.start, 1);
    }
    if (data.endDate) {
      this.selectedEnd = data.endDate;
    }

    // Set selectionStart and selectionEnd based on input dates
    if (this.selectedStart && this.selectedEnd) {
      if (this.selectedStart < this.selectedEnd) {
        this.selectionStart = true;
        this.selectionEnd = true;
      } else if (this.selectedStart > this.selectedEnd) {
        this.selectionStart = false;
        this.selectionEnd = true;
      }
      if (this.selectedStart.getMonth() === this.selectedEnd.getMonth()) {
        this.selectionEnd = false;
      }
      this.validateAndSetDateArray();
    } else {
      // Both selectionStart and selectionEnd are true if startDate and endDate are not provided or invalid
      this.selectionStart = false;
      this.selectionEnd = false;
    }
  }

  nextDate(): void {
    this.start = addMonths(this.start, 1);
    this.end = addMonths(this.start, 1);
  }

  previousDate(): void {
    this.start = subMonths(this.start, 1);
    this.end = subMonths(this.end, 1);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(data: {startDate: Date | null, endDate: Date | null}): void {
    if (data) {
      if (data.startDate != null && data.endDate != null) {
        this.selectedDate = data;
        this.initialize(data);
      } else {
        this.resetSelection();
      }
    }
  }

  updateStartCalendar(date: Date) {
    this.end = addMonths(date, 1);
  }

  updateEndCalendar(date: Date) {
    this.start = subMonths(date, 1);
  }
}

