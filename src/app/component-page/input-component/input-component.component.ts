import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {PhoneNumberService} from "../../../components/input/phone-number-input/phone-number.service";

@Component({
  selector: 'app-input-component',
  templateUrl: './input-component.component.html',
  styleUrl: './input-component.component.css'
})
export class InputComponentComponent implements OnInit {
  service = inject(PhoneNumberService);
  selected = 0;
  displaySelected: any;

  numberInput = '+15551234567';

  finalList: any[] = [];

  list: any[] = [
    {
      id: 0,
      icon: 'ri-arrow-left-up-fill',
      title: 'Zero'
    },
    {
      id: 1,
      icon: 'ri-corner-down-right-fill',
      title: 'One'
    },
    {
      id: 2,
      icon: 'ri-expand-width-fill',
      title: 'Two'
    },
    {
      id: 3,
      icon: 'ri-scroll-to-bottom-line',
      title: 'Three'
    }
  ]

  @ViewChild('codePoint', {static: true}) codePoint!: ElementRef<HTMLElement>;

  filter(item: any) {
    if (item) {
      this.list = this.finalList.filter(d => d.title.toLowerCase().includes(item.toLowerCase()));
    } else {
      this.list = this.finalList;
    }
  }

  ngOnInit(): void {
    this.finalList = this.list;
    this.getSelected(this.selected);
  }

  getSelected(item: any) {
    console.log(item);
    this.displaySelected = this.list.find(d => d.id === item);
  }

  phoneEvent(event: any) {
    console.log(event, this.service.getNationalFormat(event));
  }
}
