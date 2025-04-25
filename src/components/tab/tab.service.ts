import { Injectable } from '@angular/core';
import {ReplaySubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TabService {
  selected = new ReplaySubject<any>();
  setValue = new ReplaySubject<any>();
  setStretched = new ReplaySubject<any>();
  setType = new ReplaySubject<any>();

  select = (value: any) => {
    this.selected.next(value);
  }

  stretch = (value: any) => {
    this.setStretched.next(value);
  }
}
