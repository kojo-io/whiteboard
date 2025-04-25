import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-test-modal',
  templateUrl: './test-modal.component.html',
  styleUrl: './test-modal.component.css'
})
export class TestModalComponent {
  @Input() name: string = '';
  @Input() description: string = '';

}
