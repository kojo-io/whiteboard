import { Injectable } from '@angular/core';
import {ReplaySubject, Subject} from "rxjs";

@Injectable()
export class RadioButtonService {

  selected = new ReplaySubject<any>();
  setName = new ReplaySubject<any>();
  setValue = new ReplaySubject<any>();
  constructor() { }

  select = (value: any) => {
    this.selected.next(value);
  }
}
