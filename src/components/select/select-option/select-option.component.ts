import {Component, inject, Inject, Input, OnInit} from '@angular/core';
import {SelectService} from "../select.service";

@Component({
  selector: 'sc-select-option',
  templateUrl: './select-option.component.html',
  styleUrl: './select-option.component.css'
})
export class SelectOptionComponent implements OnInit{
  @Input() value: any;
  @Input() label: string = '';
  @Input() disabled = false;
  @Input() selected = false;
  template: boolean = false

  @Inject(SelectService) private service = inject(SelectService);


  select() {
    if (this.disabled) {
      return;
    }
    this.service.selected.next({value: this.value, label: this.label});
    this.service.clearSearch.next(true);
  }

  ngOnInit(): void {
    if(this.selected) {
      this.service.incoming.next({value: this.value, label: this.label});
    }

    this.service.templateMode.subscribe({
      next: result => {
        this.template = result;
      }
    })
  }
}
