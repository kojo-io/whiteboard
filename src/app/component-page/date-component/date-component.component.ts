import { Component, OnInit } from '@angular/core';
import {addDays, addMonths, subMonths} from "date-fns";

@Component({
  selector: 'app-date-component',
  templateUrl: './date-component.component.html',
  styleUrl: './date-component.component.css'
})
export class DateComponentComponent implements OnInit {
  start: Date = subMonths(new Date(), 12);
  end: Date = addDays(this.start, 40);
  date = new Date();
  selectedDate = {startDate: this.start, endDate: this.end};
  selectedDate1 = {startDate: this.start, endDate: this.end};
  ngOnInit(): void {
  }

  dateChanged(data: any): void {
    console.log(data);
  }
}
