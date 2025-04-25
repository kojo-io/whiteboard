import {Component, inject, Inject, Input, OnInit} from '@angular/core';
import {MultiSelectService} from "../multi-select.service";

@Component({
  selector: 'sc-multi-select-option',
  templateUrl: './multi-select-option.component.html',
  styleUrl: './multi-select-option.component.css'
})
export class MultiSelectOptionComponent implements OnInit{
  @Input() value: any;
  @Input() label: string = '';
  @Input() disabled = false;
  template: boolean = false

  @Inject(MultiSelectService) private service = inject(MultiSelectService);


  select() {
    if (this.disabled) {
      return;
    }
    this.service.selected.next({value: this.value, label: this.label});
    this.service.clearSearch.next(true);
  }

  ngOnInit(): void {

  }
}

