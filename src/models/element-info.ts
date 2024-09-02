export interface ElementInfo {
  id: string;
  type: 'polygon' | 'rectangle' | 'ellipse' | 'line' | 'single arrow' | 'double arrow' | 'text box';
  strokeColor: string;
  strokeWidth: number;
  positonX: number;
  positonY: number;
  fill: string;
  radius: number;
  width: number;
  height: number;
  points: [number, number][];
  numberOfPoints: number;
}
