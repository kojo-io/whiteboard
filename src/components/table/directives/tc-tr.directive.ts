import { Directive } from '@angular/core';

@Directive({
  selector: '[Tr]',
  host: {
    'class': 'bg-white border-b hover:bg-gray-100'
  }
})
export class TrDirective {

  constructor() { }

}
