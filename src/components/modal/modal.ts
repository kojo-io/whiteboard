import {TemplateRef, Type} from "@angular/core";

export class Modal<T = any> {
  content!: string | Type<any> | TemplateRef<any>;
  data?: {[key: string]: any};
  context?: T;
  size?: 'normal'| 'large' | 'fullscreen' | undefined;
  height?: string;
  width?: 'auto' | 'custom' | undefined;
  center?: boolean | undefined;
  backdropClose?: boolean | undefined;
  rounded?: boolean | undefined;
}
