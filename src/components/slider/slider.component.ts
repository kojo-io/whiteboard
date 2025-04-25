import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {ComponentService} from "../component.service";

@Component({
  selector: 'sc-slider',
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => SliderComponent),
    }
  ]
})
export class SliderComponent implements ControlValueAccessor {
  @Input() model: string = '';
  @Input() disabled = false;
  @Input() maxValue = 100;
  @Input() minValue = 0;
  context: any;
  onChange = (_: any) => {};
  onTouched = (_?: any) => {};
  id = ComponentService.uuid();
  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: (_: any) => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(obj: any): void {
    this.model = obj;
  }

  updateForm(value: any) {
    this.onChange(value);
  }

}
