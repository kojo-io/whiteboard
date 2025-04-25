import { Directive } from '@angular/core';

@Directive({
  selector: '[DropDownItem]',
  host: {
    'class': 'absolute z-10 dropdown-menu-list hidden'
  }
})
export class DropDownItemDirective {

  constructor() { }

}
