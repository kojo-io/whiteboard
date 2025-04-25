import {Component, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'sc-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css'
})
export class DropdownComponent {
  @ViewChild('dropdown') droElement!: ElementRef<HTMLElement>;
}
