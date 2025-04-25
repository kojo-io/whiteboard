import {
  AfterViewInit,
  Component,
  EventEmitter, forwardRef,
  Input,
  OnInit,
  Output,
  TemplateRef
} from '@angular/core';
import {addDays, format, getWeek, startOfWeek} from 'date-fns';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'sc-calendar-mini',
  templateUrl: './calendar-mini.component.html',
  styleUrl: './calendar-mini.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => CalendarMiniComponent),
    }
  ]
})
export class CalendarMiniComponent implements OnInit, AfterViewInit, ControlValueAccessor {
  onChange = (_: any) => {};
  onTouched = (_?: any) => {};
  date: Date = new Date();
  smallCalendarView: 'month' | 'all month' | 'year' = 'month';
  @Input() mode: 'single' | 'range' = 'single';
  @Input() dateView : 'month' | 'date' | 'year' = 'date';
  @Input() showSelectedDate = true;
  @Input() selection = false;
  @Output() onSelectionChange = new EventEmitter<boolean>();
  @Output() onMonthYearChange = new EventEmitter<Date>();
  selectedYear: any;
  @Input() previousButtonTemplate?: TemplateRef<any>;
  @Input() nextButtonTemplate?: TemplateRef<any>;
  context: any;
  @Input() selectedDates: Date[] = [];

  monthYear: any;
  // month: any;
  years: number[] = [];
  currentDate = new Date();
  today = new Date();

  @Input() useUTC = false;
  @Input() disablePastDates = false;

  monthCount = 0;
  weeks: Array<Week> = [];
  AllDates: Array<any> = [];
  AllDays: any[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  AllMonths: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  constructor() {
  }

  ngOnInit(): void {
    this.initialize();
  }

  initialize() {
    if(this.dateView === 'month') {
      this.smallCalendarView = 'all month';
    }
    if(this.dateView === 'year') {
      this.smallCalendarView = 'year';
    }
    this.selectedYear = this.date.getFullYear();
    this.years = Array.from({ length: 12 }, (_, i) => 2016 + i);
    this.GetCalendar(this.date.getFullYear(), this.date.getMonth());
  }

  GetCalendar(year: number, month: number) {
    this.currentDate = new Date(year, month, 1);
    this.selectedYear = year;
    this.AllDates = this.useUTC
      ? this.DaysInMonthUTC(year, month)
      : this.DaysInMonth(year, month);
    this.GetWeeks(this.AllDates);
  }

  GetDefaultCalendar() {
    this.AllDates = this.useUTC
      ? this.DaysInMonthUTC(this.date.getFullYear(), this.date.getMonth())
      : this.DaysInMonth(this.date.getFullYear(), this.date.getMonth());
    this.GetWeeks(this.AllDates);
  }

  private DaysInMonth(year: number, month: number): Date[] {
    const days: Date[] = [];
    const date = new Date(year, month, 1);
    this.monthYear = `${this.AllMonths[month]} ${year}`;
    this.monthCount = month;
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }

  private DaysInMonthUTC(year: number, month: number): Date[] {
    const days: Date[] = [];
    const date = new Date(Date.UTC(year, month, 1));
    this.monthYear = `${this.AllMonths[month]} ${year}`;
    this.monthCount = month;
    while (date.getUTCMonth() === month) {
      days.push(new Date(date));
      date.setUTCDate(date.getUTCDate() + 1);
    }
    return days;
  }

  selectMonth(month: string) {
    if (this.dateView !== 'month') {
      this.smallCalendarView = 'month'
    }
    this.monthCount = this.AllMonths.findIndex(u => u === month);
    this.GetCalendar(this.selectedYear, this.monthCount);
    this.selection = false;
    this.onSelectionChange.emit(false);
    this.onMonthYearChange.emit(this.currentDate);
    if (this.dateView === 'month') {
      this.onChange(this.currentDate);
    }
  }

  selectYear(year: number) {
    if (year > this.today.getFullYear()-200 && year < this.today.getFullYear()+500) {
      this.GetCalendar(year, this.currentDate.getMonth());
      this.selection = false;
      this.onSelectionChange.emit(false);
      this.onMonthYearChange.emit(this.currentDate);
      if(this.dateView === 'year') {
        this.onChange(this.currentDate);
      }
    }
  }

  GetWeeks(dates: Date[]) {
    const weeks: Week[] = [];
    dates.forEach((date) => {
      const week = getWeek(date);
      let weekObj = weeks.find((w) => w.week === week);
      if (!weekObj) {
        weekObj = { week, dates: [] };
        weeks.push(weekObj);
      }
      weekObj.dates.push(date);
    });

    for (const weekObj of weeks) {
      if (weekObj.dates.length < 7) {
        const newDays: any[] = [];
        for(let i = 0; i < 7; i++) {
          const newDate = addDays(startOfWeek(weekObj.dates[0]), i);
          if (this.mode === 'range') {
            if (weekObj.dates.find(date => format(date, 'MM/dd/yyyy') === format(newDate, 'MM/dd/yyyy')) != null) {
              newDays.push(newDate);
            } else {
              newDays.push(null);
            }
          } else {
            newDays.push(newDate);
          }
        }
        weekObj.dates = newDays;
      }
    }

    this.weeks = weeks;
  }

  selectDate(date: Date) {
    if (!this.compareDate(date) && this.disablePastDates) {
      return;
    }
    if (this.mode !== 'range') {
      if (date > this.currentDate) {
        this.GetNextMonth();
      }
      if (date< this.currentDate) {
        this.GetPreviousMonth();
      }
    } else {
      this.selection = true;
      this.onSelectionChange.emit(this.selection);
    }
    this.date = date;
    this.onChange(this.date);
  }

  GetPreviousMonth() {
    this.monthCount--;
    if (this.monthCount < 0) {
      this.monthCount = 11;
      this.selectedYear--;
    }
    this.GetCalendar(this.selectedYear, this.monthCount);
  }

  GetNextMonth() {
    this.monthCount++;
    if (this.monthCount > 11) {
      this.monthCount = 0;
      this.selectedYear++;
    }
    this.GetCalendar(this.selectedYear, this.monthCount);
  }

  GetNextYears = () => {
    const tYears: number[] = []
    for (let i = 0; i < 12; i++) {
      tYears.push(this.years[this.years.length - 1] + (i + 1))
    }
    this.years = tYears
  }

  GetPreviousYears = () => {
    if (this.years[0] > 1800) {
      const tYears: number[] = []
      for (let i = 0; i < 12; i++) {
        tYears.push(this.years[0] - (12 - i))
      }
      this.years = tYears;
    }
  }

  getToday(date: Date): boolean {
    const today = format(new Date(), 'MM/dd/yyyy');
    const current = format(new Date(date), 'MM/dd/yyyy');
    return today === current;
  }

  findDateInDates(date: Date): boolean {
    const dates = this.selectedDates.filter(dateItem => dateItem.getMonth() === this.monthCount);
    return !!dates.find(dateItem => format(dateItem, 'MM/dd/yyyy') === format(date, 'MM/dd/yyyy'));

  }

  compareDate(date: Date): boolean {
    return date < new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());
  }

  setToday() {
    this.currentDate = new Date();
    this.date = this.currentDate;
    this.onChange(this.date);
    this.selection = false;
    this.onSelectionChange.emit(false);
    this.GetDefaultCalendar();
  }

  updateView(view: any) {
    if(this.dateView === 'month') {
      this.smallCalendarView = 'all month';
      return;
    }
    if(this.dateView === 'year') {
      this.smallCalendarView = 'year';
      return;
    }
    this.smallCalendarView = view;
  }

  writeValue(obj: Date): void {
    if (obj) {
      if (this.selection) {
        const selectedDate = new Date(obj);
        this.GetCalendar(selectedDate.getFullYear(), selectedDate.getMonth());
      } else {
        this.date = new Date(obj);
        this.GetCalendar(this.date.getFullYear(), this.date.getMonth());
      }
    }
  }

  isSelectedDate(date: Date): boolean {
    return this.date && format(this.date, 'MM/dd/yyyy') === format(date, 'MM/dd/yyyy');
  }

  isLastSelectedDate(date: Date): boolean {
    return this.selectedDates?.length > 0 && format(this.selectedDates[this.selectedDates.length - 1], 'MM/dd/yyyy') === format(date, 'MM/dd/yyyy');
  }

  isFirstSelectedDate(date: Date): boolean {
    return this.selectedDates?.length > 0 && format(this.selectedDates[0], 'MM/dd/yyyy') === format(date, 'MM/dd/yyyy');
  }

  ngAfterViewInit(): void {
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}

interface Week {
  dates: Date[];
  week: number;
}
