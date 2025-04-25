import {Component, Input} from '@angular/core';

@Component({
  selector: 'sc-indeterminate-progress-bar',
  templateUrl: './indeterminate-progress-bar.component.html',
  styleUrl: './indeterminate-progress-bar.component.css'
})
export class IndeterminateProgressBarComponent {
  @Input() rounded: '' | undefined = undefined;
}
