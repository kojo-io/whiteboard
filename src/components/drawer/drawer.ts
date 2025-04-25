import {TemplateRef, Type} from "@angular/core";

export class Drawer<T = any> {
  content!: string | Type<any> | TemplateRef<any>;
  data?: {[key: string]: any};
  context?: T;
  size?: 'normal'| 'large' | 'fullscreen' | undefined;
  height?: string;
  width?: string;
  center?: boolean | undefined;
  backdropClose?: boolean | undefined;
  rounded?: boolean | undefined;
  position?: 'left' | 'right';
}
