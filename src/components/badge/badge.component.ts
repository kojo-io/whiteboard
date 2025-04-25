import {Component, Input} from '@angular/core';

@Component({
  selector: 'sc-badge',
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.css'
})
export class BadgeComponent {
  @Input() counter = 0;
  @Input() rightPosition = -4;
  @Input() topPosition = -6;
  @Input() color = 'white';
  @Input() backgroundColor = 'red';
  @Input() flex: '' | 'normal' | undefined = undefined;


  formatCount(num: number) {
    let formattedNum;

    if (Math.abs(num) >= 1.0e9) {
      formattedNum = (num / 1.0e9).toFixed(2);
      return formattedNum.endsWith(".00") ? parseInt(formattedNum) + "B" : formattedNum + "B";
    } else if (Math.abs(num) >= 1.0e6) {
      formattedNum = (num / 1.0e6).toFixed(2);
      return formattedNum.endsWith(".00") ? parseInt(formattedNum) + "M" : formattedNum + "M";
    } else if (Math.abs(num) >= 1.0e3) {
      formattedNum = (num / 1.0e3).toFixed(2);
      return formattedNum.endsWith(".00") ? parseInt(formattedNum) + "k" : formattedNum + "k";
    } else {
      return num.toString();
    }
  }
}
