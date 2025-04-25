import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {RadioButtonService} from "../radio-button.service";
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {ComponentService} from "../../component.service";

@Component({
  selector: 'sc-radio-group',
  templateUrl: './radio-group.component.html',
  styleUrls: ['./radio-group.component.scss'],
  providers: [
    RadioButtonService,
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => RadioGroupComponent)
    }
  ]
})

export class RadioGroupComponent implements OnInit{
  id = ComponentService.uuid();

  @Input() orientation: 'horizontal' | 'vertical' = 'vertical';
  @Input() disabled = false;

  onChange = (_: any) => {};
  onTouched = () => {};
  constructor(private radioService: RadioButtonService) {
  }

  ngOnInit(): void {
    this.radioService.selected.subscribe({
      next: value => {
        if (value != null || value != undefined) {
          this.onChange(value);
        }
      }
    })

    this.radioService.setName.next(this.id);
  }

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(obj: any): void {
    if (obj !== null && obj !== undefined) {
      this.radioService.select(obj);
    }
  }
}
