import {Component, Input} from '@angular/core';

@Component({
  selector: 'sc-label',
  templateUrl: './label.component.html',
  styleUrl: './label.component.css'
})
export class LabelComponent {
  @Input() for = '';
}
