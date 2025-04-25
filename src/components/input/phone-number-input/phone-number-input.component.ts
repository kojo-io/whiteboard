import {Component, ElementRef, forwardRef, inject, Input, OnInit, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {ComponentService} from "../../component.service";
import {CountryCodesService} from "../helper/country-codes.service";
import {DomSanitizer} from "@angular/platform-browser";
import parsePhoneNumber from 'libphonenumber-js'
import {PhoneNumberService} from "./phone-number.service";

@Component({
  selector: 'sc-phone-input',
  templateUrl: './phone-number-input.component.html',
  styleUrl: './phone-number-input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => PhoneNumberInputComponent),
    }
  ]
})
export class PhoneNumberInputComponent implements OnInit, ControlValueAccessor {

  service = inject(PhoneNumberService);
  @ViewChild('phoneInput') selectInput!: ElementRef<HTMLInputElement>;
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() model: string = '';
  @Input() required: boolean = false;
  @Input() name: string = '';
  @Input() readOnly: boolean = false;
  @Input() disabled = false;
  @Input() invalid: boolean = false;
  @Input() touched: boolean = false;
  @Input() defaultCountryCode = 'GH';
  @Input() dataType: 'NumberOnly' | 'FullObject' = 'FullObject';
  focused: boolean = false;
  rawPhoneNumber: string = '';
  formattedValue: string = '';
  searchValue: string = '';
  flagClicked = false;

  countryCode = inject(CountryCodesService);
  sanitizer = inject(DomSanitizer);
  selectedCountry: any;
  shadowCountries: any[] = [];

  onChange = (_: any) => {};
  onTouched = (_?: any) => {
    this.touched = true;
  };
  id = ComponentService.uuid();

  ngOnInit(): void {
    this.shadowCountries = this.countryCode.countries;
    this.selectedCountry = this.countryCode.countries.find(item => item.isoAlpha2 === this.defaultCountryCode);
  }

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
    if (obj) {
      this.selectedCountry = this.countryCode.countries.find(item => item.dialCode === this.service.getCode(obj));
      this.onInput(this.service.getNationalFormat(obj));
    }
  }

  checkInvalid() {
    this.invalid = this.required && !this.model;
  }

  // Method to handle focus event
  onFocus() {
    this.focused = true;
  }

  // Method to handle blur event
  onBlur() {
    this.focused = false;
    this.flagClicked = false;
    this.onTouched();  // Also mark as touched
  }

  // Handle the input event and format phone number dynamically
  onInput(value: any) {
    // Remove any non-digit characters (keep only numbers)
    this.formattedValue = value;
    this.rawPhoneNumber = value.replace(/\D/g, '');

    // Limit the number of digits to 10 or 11
    if (this.rawPhoneNumber.length > 11) {
      this.rawPhoneNumber = this.rawPhoneNumber.slice(0, 11);
    }

    if (this.rawPhoneNumber.length === 0) {
      this.model = '';
      this.touched = true;
    }

    console.log('raw', this.rawPhoneNumber, this.formattedValue);

    // Format the raw phone number for display
    this.model = this.service.formatPhoneNumber(this.rawPhoneNumber);

    this.checkInvalid();
    this.phoneNumberToReturn();
  }


  // Restrict input to numbers only and prevent input if length is 11 or more
  onKeyDown(event: KeyboardEvent): boolean {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'];

    // If rawPhoneNumber length is 11 and a new number is pressed, prevent input
    if (
      this.rawPhoneNumber.length >= 11 &&
      !(allowedKeys.includes(event.key)) // Allow control keys like Backspace, Arrow keys, etc.
    ) {
      event.preventDefault(); // Block further numeric input
      return false;
    }

    // Allow control keys and numeric keys only
    if (
      allowedKeys.includes(event.key) || // Check if it's a control key
      /^[0-9]$/.test(event.key) // Allow numeric keys using regex
    ) {
      return true;
    }

    // Prevent any other key press
    event.preventDefault();
    return false;
  }


  phoneNumberToReturn() {
    if (this.rawPhoneNumber.length === 10 || this.rawPhoneNumber.length === 11) {
      const phone = parsePhoneNumber(this.formattedValue, this.selectedCountry.isoAlpha2);

      // Notify Angular with the raw number
      if (this.dataType === 'FullObject') {
        this.onChange(phone);
      } else {
        this.onChange(phone?.number);
      }
    }
  }


  selectCountryCode(code: any) {
    this.selectedCountry = code;
    this.shadowCountries = this.countryCode.countries;
    this.searchValue = '';
    this.phoneNumberToReturn();
    this.flagClicked = false;
    this.selectInput.nativeElement.focus();
  }

  filterCountries (country: any) {
    this.shadowCountries = this.countryCode.countries.filter(countryCode => countryCode.name.toLowerCase().includes(country.toLowerCase()));
  }

  onClick() {
    this.selectInput.nativeElement.focus();
    this.flagClicked = true;
  }
}

