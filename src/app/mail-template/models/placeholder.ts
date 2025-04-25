// placeholder.interface.ts
export interface Placeholder {
  name: string;          // The placeholder name without braces (e.g., "PrimaryColor")
  type: 'text' | 'color' | 'date'; // The input type needed
  defaultValue: string;  // Default value for the placeholder
  currentValue: string;  // Current user-provided value
  description?: string;  // Optional description from the HTML
  isCssValue: boolean;   // Whether it's used in CSS (like #{PrimaryColor})
}
