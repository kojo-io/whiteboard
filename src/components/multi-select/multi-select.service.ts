import { Injectable } from '@angular/core';
import {ReplaySubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MultiSelectService {

  selected = new ReplaySubject<any>();
  //for default or initial selected data
  incoming = new ReplaySubject<any>();
  clearSearch = new ReplaySubject<boolean>();
}
