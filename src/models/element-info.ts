import {TextBoxElement} from "./text-box-element";
import {PolygonElement} from "./polygonElement";
import {ImageElement} from "./image-element";

export interface ElementInfo extends TextBoxElement, PolygonElement, ImageElement {
  id: string;
  type: 'text box' | 'image' | 'barcode' | 'qrcode' | 'cursor' | 'polygon';
  positionX: number;
  positionY: number;
  borderStyle? : 'none' | 'hidden' | 'dotted' | 'dashed' | 'solid' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset';
  borderWidth? : number;
  hidden?: boolean;
}
