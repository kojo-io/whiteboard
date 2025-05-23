// models/component-config.model.ts
export type ComponentConfig = {
  name: string;
  html: string;
  styles: string;
  classList: string[];
  inputs?: { name: string; type: string }[];
  outputs?: { name: string; eventName: string }[];
};
