import { Directive } from '@angular/core';

@Directive({
  selector: '[Thead]',
  host: {
    'class': 'text-[12px] text-gray-700 uppercase bg-gray-50 border-b'
  }
})
export class TheadDirective {

  constructor() { }

}
