export interface ElementInfo {
  fill: string;
  stroke: string;
  strokeWidth: string;
  id: string;
  parentId: string;
  numberOfPoints?: number;
  radiusInput?: number;
  radiusX: string;
  radiusY: string;
  shape: 'polygon' | 'rectangle' | 'ellipse' | 'cursor',
  offsetX: number;
  offsetY: number;
  rectStartPoint: [number, number];
  positionX: number;
  positionY: number;
}
