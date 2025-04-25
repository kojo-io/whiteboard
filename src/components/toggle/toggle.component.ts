import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {ComponentService} from "../component.service";

@Component({
  selector: 'sc-switch',
  templateUrl: './toggle.component.html',
  styleUrl: './toggle.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => ToggleComponent)
    }
  ]
})
export class ToggleComponent implements ControlValueAccessor {
  @Input() toggled = false;
  id = ComponentService.uuid();
  onChange = (_: any) => {};
  onTouched = () => {};
  @Input() disabled = false;

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(obj: boolean): void {
    this.toggled = obj;
  }

  toggle(obj: boolean) {
    if (!this.disabled) {
      this.toggled = obj;
      this.onChange(this.toggled);
    }
  }
}
