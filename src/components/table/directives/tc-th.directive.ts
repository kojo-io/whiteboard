import { Directive } from '@angular/core';

@Directive({
  selector: '[Th]',
  host: {
    'class': 'px-[24px] py-[12px]'
  }
})
export class ThDirective {

  constructor() { }

}
