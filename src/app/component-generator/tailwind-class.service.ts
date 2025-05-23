// tailwind-class.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TailwindClassService {
  private colors = ['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'indigo', 'gray'];
  private shades = ['100', '200', '300', '400', '500', '600', '700', '800', '900'];
  private sizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'];
  private weights = ['thin', 'extralight', 'light', 'normal', 'medium', 'semibold', 'bold', 'extrabold', 'black'];

  textAlignClasses = ['text-left', 'text-center', 'text-right', 'text-justify'];
  textColorClasses = this.generateColorClasses('text');
  bgColorClasses = this.generateColorClasses('bg');
  textSizeClasses = this.sizes.map(size => `text-${size}`);
  borderClasses = ['border', 'border-2', 'border-red-500'];
  shadowClasses = ['shadow', 'shadow-md', 'shadow-lg'];
  roundedClasses = ['rounded', 'rounded-md', 'rounded-lg'];
  fontWeightClasses = this.weights.map(weight => `font-${weight}`);

  // Padding Classes
  paddingClasses = this.generatePaddingMarginClasses('p');
  paddingHorizontalClasses = this.generatePaddingMarginClasses('px');
  paddingVerticalClasses = this.generatePaddingMarginClasses('py');
  paddingTopClasses = this.generatePaddingMarginClasses('pt');
  paddingBottomClasses = this.generatePaddingMarginClasses('pb');
  paddingLeftClasses = this.generatePaddingMarginClasses('pl');
  paddingRightClasses = this.generatePaddingMarginClasses('pr');

  // Margin Classes
  marginClasses = this.generatePaddingMarginClasses('m');
  marginHorizontalClasses = this.generatePaddingMarginClasses('mx');
  marginVerticalClasses = this.generatePaddingMarginClasses('my');
  marginTopClasses = this.generatePaddingMarginClasses('mt');
  marginBottomClasses = this.generatePaddingMarginClasses('mb');
  marginLeftClasses = this.generatePaddingMarginClasses('ml');
  marginRightClasses = this.generatePaddingMarginClasses('mr');

  private generateColorClasses(prefix: string): string[] {
    return this.colors.flatMap(color => this.shades.map(shade => `${prefix}-${color}-${shade}`));
  }

  private generatePaddingMarginClasses(prefix: string): string[] {
    const values = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32];
    return values.map(value => `${prefix}-${value}`);
  }

  getClassesByKey(key: string): string[] {
    const map: Record<string, string[]> = {
      textAlignClasses: this.textAlignClasses,
      textColorClasses: this.textColorClasses,
      bgColorClasses: this.bgColorClasses,
      textSizeClasses: this.textSizeClasses,
      fontWeightClasses: this.fontWeightClasses,
      paddingClasses: this.paddingClasses,
      marginClasses: this.marginClasses,
      borderClasses: this.borderClasses,
      shadowClasses: this.shadowClasses,
      roundedClasses: this.roundedClasses,
      paddingHorizontalClasses: this.paddingHorizontalClasses,
      paddingVerticalClasses: this.paddingVerticalClasses,
      paddingTopClasses: this.paddingTopClasses,
      paddingBottomClasses: this.paddingBottomClasses,
      paddingLeftClasses: this.paddingLeftClasses,
      paddingRightClasses: this.paddingRightClasses,
      marginHorizontalClasses: this.marginHorizontalClasses,
      marginVerticalClasses: this.marginVerticalClasses,
      marginTopClasses: this.marginTopClasses,
      marginBottomClasses: this.marginBottomClasses,
      marginLeftClasses: this.marginLeftClasses,
      marginRightClasses: this.marginRightClasses,
    };

    return map[key] || [];
  }
}
