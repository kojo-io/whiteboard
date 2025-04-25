import {Component, forwardRef, Input} from '@angular/core';
import {ComponentService} from "../component.service";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'sc-check-box',
  templateUrl: './check-box.component.html',
  styleUrl: './check-box.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => CheckBoxComponent)
    }
  ]
})

export class CheckBoxComponent implements ControlValueAccessor {
  /** Input to set the checkbox state */
  @Input() checked = false;

  /** Input to set the indeterminate state */
  @Input() indeterminate = false;

  /** Input to set the label text */
  @Input() label = '';

  /** Input to set the unique ID for the checkbox */
  id = ComponentService.uuid();

  onChange = (_: any) => {};
  onTouched = () => {};
  @Input() disabled = false;


  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(obj: boolean): void {
    this.checked = obj;
    this.indeterminate = false;
  }

  changeState(obj: boolean): void {
    if(!this.disabled) {
      this.checked = obj;
      this.indeterminate = false;
      this.onChange(this.checked);
    }
  }
}
