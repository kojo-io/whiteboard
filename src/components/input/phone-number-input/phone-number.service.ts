import { Injectable } from '@angular/core';
import parsePhoneNumber from 'libphonenumber-js'

@Injectable({
  providedIn: 'root'
})
export class PhoneNumberService {

  constructor() { }

  getNationalFormat(phoneNumber: string) {
    const num = parsePhoneNumber(phoneNumber);
    return this.formatPhoneNumber(num?.formatNational() as string);
  }

  getCode(phoneNumber: string) {
    const num = parsePhoneNumber(phoneNumber);
    return `+${num?.countryCallingCode}`;
  }

  getInternationalFormat(phoneNumber: string) {
    const num = parsePhoneNumber(phoneNumber);
    return num?.formatInternational()
  }

  getURIFormat(phoneNumber: string) {
    const num = parsePhoneNumber(phoneNumber);
    return num?.getURI()
  }

  formatPhoneNumber(value: string): string {
    if (!value) {
      return '';
    }

    // Remove non-digit characters
    const cleaned = value.replace(/\D/g, '');

    // Match 10 or 11-digit phone numbers
    if (cleaned.length <= 11) {
      if (cleaned.length === 11) {
        // 11-digit number (assume first digit is the country code)
        return `${cleaned[0]} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
      } else if (cleaned.length === 10) {
        // Standard US-style 10-digit format
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
      } else if (cleaned.length >= 7) {
        // Format when at least 7 digits are available
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
      } else if (cleaned.length >= 4) {
        // Format when at least 4 digits are available
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
      } else {
        // Format when less than 4 digits are available
        return `(${cleaned}`;
      }
    }

    return value; // Return unformatted value if it exceeds 11 digits
  }
}
