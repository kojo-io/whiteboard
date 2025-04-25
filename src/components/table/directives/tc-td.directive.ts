import { Directive } from '@angular/core';

@Directive({
  selector: '[Td]',
  host: {
    'class': 'px-[24px] py-[16px]'
  }
})
export class TdDirective {

  constructor() { }

}
