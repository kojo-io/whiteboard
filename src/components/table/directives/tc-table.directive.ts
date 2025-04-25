import {Directive, Input} from '@angular/core';

@Directive({
  selector: '[Table]',
  host: {
    'class': 'w-full text-[12px] text-left text-gray-500'
  }
})
export class TableDirective {
  @Input() data: any[] = [];
  constructor() { }

}
