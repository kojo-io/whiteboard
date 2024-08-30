import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PolygonService {

  // createTriangle() {
  //   if (this.removeListeners) {
  //     this.removeListeners();
  //   }
  //   this.shapeType = 'polygon';
  //   const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
  //   let isDrawing = false;
  //   let startX: number;
  //   let startY: number;
  //   let currentPolygon: SVGPolygonElement | null = null;
  //   let currentRectangle: SVGRectElement | null = null;
  //   let numberOfPoints = 3; // Default to a triangle
  //   let isDragging = false;
  //   let isResizing = false;
  //   let handleAdd = false;
  //   let resizeDirection: string | null = null;
  //   let rectStartPoint: [number, number] = [0, 0];
  //   let offsetX: number; // Offset for dragging
  //   let offsetY: number;
  //   let pointsInput: number = 0;
  //
  //
  //   const createRectangle = () => {
  //     pointsInput++;
  //     let rect = document.createElementNS(SVG_NAMESPACE, 'rect');
  //     rect.setAttribute('fill', 'none'); // No fill color
  //     rect.setAttribute('stroke', 'blue'); // Border color
  //     rect.setAttribute('stroke-width', '2');
  //     rect.setAttribute('id', `${pointsInput}`);
  //     rect.style.pointerEvents = 'all';// Allow pointer events on the entire rectangle
  //     currentRectangle = rect;
  //     this.svgCanvas.appendChild(rect);
  //
  //     rect.addEventListener('click', (e) => {
  //       currentRectangle = rect;
  //       currentPolygon = document.getElementById(`${pointsInput}polygon`) as SVGPolygonElement | null;
  //       rectStartPoint = [
  //         parseFloat(currentRectangle.getAttribute('x') || '0'),
  //         parseFloat(currentRectangle.getAttribute('y') || '0')
  //       ];
  //       updateHandles(); // Update handles when rectangle is clicked
  //       updatePolygon(); // Update associated polygon when rectangle is selected
  //
  //       if (this.removeListeners) {
  //         this.removeListeners();
  //       }
  //       shapeAddListeners();
  //     });
  //
  //     if (!handleAdd) {
  //       addResizeHandles();
  //       handleAdd = true;
  //     }
  //   };
  //
  //   const createPolygon = () => {
  //     if (currentRectangle) {
  //       let poly = document.createElementNS(SVG_NAMESPACE, 'polygon');
  //       poly.setAttribute('fill', 'rgba(0, 123, 255, 0.5)'); // Optional fill color for the polygon
  //       poly.setAttribute('stroke', 'blue'); // Border color for the polygon
  //       poly.setAttribute('stroke-width', '2');
  //       let id = `${pointsInput}polygon`;
  //       poly.setAttribute('id', id);
  //       poly.style.pointerEvents = 'none'; // Disable pointer events for the polygon
  //       poly.style.margin = '10px';
  //       this.svgCanvas.appendChild(poly);
  //       currentPolygon = poly;
  //       updatePolygon(); // Update the polygon initially
  //     }
  //   };
  //
  //   const updatePolygon = () => {
  //     if (currentRectangle && currentPolygon) {
  //       const rectX = parseFloat(currentRectangle.getAttribute('x')!);
  //       const rectY = parseFloat(currentRectangle.getAttribute('y')!);
  //       const width = parseFloat(currentRectangle.getAttribute('width')!);
  //       const height = parseFloat(currentRectangle.getAttribute('height')!);
  //
  //       const margin = 15; // Define the margin between the polygon and rectangle
  //
  //       const points: [number, number][] = [];
  //       const centerX = rectX + width / 2;
  //       const centerY = rectY + height / 2;
  //
  //       if (numberOfPoints === 3) {
  //         // Triangle
  //         const pointA: [number, number] = [centerX - (width / 2) + margin, centerY + (height / 2) - margin];
  //         const pointB: [number, number] = [centerX + (width / 2) - margin, centerY + (height / 2) - margin];
  //         const pointC: [number, number] = [centerX, centerY - (height / 2) + margin];
  //         points.push(pointA, pointB, pointC);
  //       } else {
  //         // Regular polygon
  //         const radiusX = (width / 2) - margin;
  //         const radiusY = (height / 2) - margin;
  //         const angleStep = (2 * Math.PI) / numberOfPoints;
  //
  //         for (let i = 0; i < numberOfPoints; i++) {
  //           const angle = i * angleStep - Math.PI / 2; // Start from the top
  //           const x = centerX + radiusX * Math.cos(angle);
  //           const y = centerY + radiusY * Math.sin(angle);
  //           points.push([x, y]);
  //         }
  //       }
  //
  //       const pointsAttr = points.map(point => point.join(',')).join(' ');
  //       currentPolygon.setAttribute('points', pointsAttr);
  //     }
  //   };
  //
  //   const addResizeHandles = () => {
  //     if (currentRectangle) {
  //       const handles = [
  //         { position: 'top-left', cursor: 'nwse-resize' },
  //         { position: 'top-right', cursor: 'nesw-resize' },
  //         { position: 'bottom-left', cursor: 'nesw-resize' },
  //         { position: 'bottom-right', cursor: 'nwse-resize' },
  //         { position: 'top', cursor: 'ns-resize' },
  //         { position: 'bottom', cursor: 'ns-resize' },
  //         { position: 'left', cursor: 'ew-resize' },
  //         { position: 'right', cursor: 'ew-resize' }
  //       ];
  //
  //       handles.forEach(({ position, cursor }) => {
  //         const handle = document.createElementNS(SVG_NAMESPACE, 'rect');
  //         handle.setAttribute('class', `resize-handle resize-${position}`);
  //         handle.setAttribute('fill', 'white');
  //         handle.setAttribute('width', '10');
  //         handle.setAttribute('height', '10');
  //         handle.setAttribute('stroke', 'blue'); // Border color for the ellipse
  //         handle.setAttribute('stroke-width', '2');
  //         handle.setAttribute('cursor', cursor);
  //         handle.setAttribute('data-resize', position);
  //         handle.setAttribute('rx', '2.5'); // Border radius for the handle
  //         handle.setAttribute('ry', '2.5'); // Border radius for the handle
  //         this.svgCanvas.appendChild(handle);
  //       });
  //
  //       // Ensure handles are positioned correctly initially
  //       if (currentRectangle) {
  //         const handles = document.querySelectorAll('.resize-handle');
  //         handles.forEach((handle) => {
  //           handle.setAttribute('fill', 'white');
  //           const svgHandle = handle as SVGRectElement;
  //           const position = svgHandle.getAttribute('data-resize')!;
  //           updateHandlePosition(position);
  //         });
  //       }
  //     }
  //   };
  //
  //   const updateHandlePosition = (position: string) => {
  //     const handle = document.querySelector(`.resize-${position}`) as SVGRectElement;
  //     if (handle && currentRectangle) {
  //       const rect = currentRectangle!;
  //       const rectX = parseFloat(rect.getAttribute('x')!);
  //       const rectY = parseFloat(rect.getAttribute('y')!);
  //       const rectWidth = parseFloat(rect.getAttribute('width')!);
  //       const rectHeight = parseFloat(rect.getAttribute('height')!);
  //
  //       switch (position) {
  //         case 'top-left':
  //           handle.setAttribute('x', (rectX - 5).toString());
  //           handle.setAttribute('y', (rectY - 5).toString());
  //           break;
  //         case 'top-right':
  //           handle.setAttribute('x', (rectX + rectWidth - 5).toString());
  //           handle.setAttribute('y', (rectY - 5).toString());
  //           break;
  //         case 'bottom-left':
  //           handle.setAttribute('x', (rectX - 5).toString());
  //           handle.setAttribute('y', (rectY + rectHeight - 5).toString());
  //           break;
  //         case 'bottom-right':
  //           handle.setAttribute('x', (rectX + rectWidth - 5).toString());
  //           handle.setAttribute('y', (rectY + rectHeight - 5).toString());
  //           break;
  //         case 'top':
  //           handle.setAttribute('x', (rectX + rectWidth / 2 - 5).toString());
  //           handle.setAttribute('y', (rectY - 5).toString());
  //           break;
  //         case 'bottom':
  //           handle.setAttribute('x', (rectX + rectWidth / 2 - 5).toString());
  //           handle.setAttribute('y', (rectY + rectHeight - 5).toString());
  //           break;
  //         case 'left':
  //           handle.setAttribute('x', (rectX - 5).toString());
  //           handle.setAttribute('y', (rectY + rectHeight / 2 - 5).toString());
  //           break;
  //         case 'right':
  //           handle.setAttribute('x', (rectX + rectWidth - 5).toString());
  //           handle.setAttribute('y', (rectY + rectHeight / 2 - 5).toString());
  //           break;
  //       }
  //     }
  //   };
  //
  //   const updateHandles = () => {
  //     // Remove old handles
  //     const oldHandles = document.querySelectorAll('.resize-handle');
  //     oldHandles.forEach(handle => handle.remove());
  //
  //     // Re-add handles
  //     addResizeHandles();
  //   };
  //
  //   const updateRectangle = (startX: number, startY: number, currentX: number, currentY: number) => {
  //     const width = currentX - startX;
  //     const height = currentY - startY;
  //
  //     // Update rectangle's attributes
  //     if (currentRectangle) {
  //       currentRectangle.setAttribute('x', Math.min(startX, currentX).toString());
  //       currentRectangle.setAttribute('y', Math.min(startY, currentY).toString());
  //       currentRectangle.setAttribute('width', Math.abs(width).toString());
  //       currentRectangle.setAttribute('height', Math.abs(height).toString());
  //
  //       // Update handles position
  //       updateHandles();
  //       updatePolygon();
  //     }
  //   };
  //
  //   const updateRectangleSize = (currentX: number, currentY: number) => {
  //     if (currentRectangle) {
  //       const rectX = parseFloat(currentRectangle.getAttribute('x')!);
  //       const rectY = parseFloat(currentRectangle.getAttribute('y')!);
  //       const width = parseFloat(currentRectangle.getAttribute('width')!);
  //       const height = parseFloat(currentRectangle.getAttribute('height')!);
  //
  //       switch (resizeDirection) {
  //         case 'top-left':
  //           const newTopLeftX = Math.min(currentX, rectX + width);
  //           const newTopLeftY = Math.min(currentY, rectY + height);
  //           const newTopLeftWidth = Math.max(width + (rectX - newTopLeftX), 0);
  //           const newTopLeftHeight = Math.max(height + (rectY - newTopLeftY), 0);
  //
  //           currentRectangle.setAttribute('x', newTopLeftX.toString());
  //           currentRectangle.setAttribute('y', newTopLeftY.toString());
  //           currentRectangle.setAttribute('width', newTopLeftWidth.toString());
  //           currentRectangle.setAttribute('height', newTopLeftHeight.toString());
  //           break;
  //
  //         case 'top-right':
  //           const newTopRightWidth = Math.max(currentX - rectX, 0);
  //           const newTopRightHeight = Math.max(height + (rectY - currentY), 0);
  //
  //           currentRectangle.setAttribute('y', Math.min(currentY, rectY + height).toString());
  //           currentRectangle.setAttribute('width', newTopRightWidth.toString());
  //           currentRectangle.setAttribute('height', newTopRightHeight.toString());
  //           break;
  //
  //         case 'bottom-left':
  //           const newBottomLeftX = Math.min(currentX, rectX + width);
  //           const newBottomLeftWidth = Math.max(width + (rectX - newBottomLeftX), 0);
  //           const newBottomLeftHeight = Math.max(currentY - rectY, 0);
  //
  //           currentRectangle.setAttribute('x', newBottomLeftX.toString());
  //           currentRectangle.setAttribute('width', newBottomLeftWidth.toString());
  //           currentRectangle.setAttribute('height', newBottomLeftHeight.toString());
  //           break;
  //
  //         case 'bottom-right':
  //           const newBottomRightWidth = Math.max(currentX - rectX, 0);
  //           const newBottomRightHeight = Math.max(currentY - rectY, 0);
  //
  //           currentRectangle.setAttribute('width', newBottomRightWidth.toString());
  //           currentRectangle.setAttribute('height', newBottomRightHeight.toString());
  //           break;
  //
  //         case 'top':
  //           const newTopHeight = Math.max(height + (rectY - currentY), 0);
  //
  //           currentRectangle.setAttribute('y', Math.min(currentY, rectY + height).toString());
  //           currentRectangle.setAttribute('height', newTopHeight.toString());
  //           break;
  //
  //         case 'bottom':
  //           const newBottomHeight = Math.max(currentY - rectY, 0);
  //
  //           currentRectangle.setAttribute('height', newBottomHeight.toString());
  //           break;
  //
  //         case 'left':
  //           const newLeftX = Math.min(currentX, rectX + width);
  //           const newLeftWidth = Math.max(width + (rectX - newLeftX), 0);
  //
  //           currentRectangle.setAttribute('x', newLeftX.toString());
  //           currentRectangle.setAttribute('width', newLeftWidth.toString());
  //           break;
  //
  //         case 'right':
  //           const newRightWidth = Math.max(currentX - rectX, 0);
  //
  //           currentRectangle.setAttribute('width', newRightWidth.toString());
  //           break;
  //       }
  //
  //       updateHandles();
  //       updatePolygon();  // Ensure polygon is updated after resizing
  //     }
  //   };
  //
  //   const startDragging = (e: MouseEvent) => {
  //     if (currentRectangle) {
  //       const rect = this.body.getBoundingClientRect();
  //       offsetX = e.clientX - rect.left - parseFloat(currentRectangle.getAttribute('x')!);
  //       offsetY = e.clientY - rect.top - parseFloat(currentRectangle.getAttribute('y')!);
  //       isDragging = true;
  //       e.stopPropagation(); // Prevent resize logic from interfering
  //     }
  //   };
  //
  //   const dragRectangle = (e: MouseEvent) => {
  //     if (isDragging && currentRectangle) {
  //       const rect = this.body.getBoundingClientRect();
  //       const newX = e.clientX - rect.left - offsetX;
  //       const newY = e.clientY - rect.top - offsetY;
  //
  //       currentRectangle.setAttribute('x', newX.toString());
  //       currentRectangle.setAttribute('y', newY.toString());
  //
  //       updateHandles();
  //       updatePolygon();
  //     }
  //   };
  //
  //   const onMouseDown = (e: MouseEvent) => {
  //     if (e.target instanceof SVGRectElement) {
  //       if (e.target.classList.contains('resize-handle')) {
  //         resizeDirection = (e.target as SVGRectElement).getAttribute('data-resize')!;
  //         isResizing = true;
  //       } else {
  //         currentRectangle = e.target as SVGRectElement;
  //         startDragging(e);
  //       }
  //     } else {
  //       const rect = this.body.getBoundingClientRect();
  //       startX = e.clientX - rect.left;
  //       startY = e.clientY - rect.top;
  //
  //       rectStartPoint = [startX, startY];
  //
  //       createRectangle();
  //       createPolygon();
  //
  //       isDrawing = true;
  //     }
  //   };
  //
  //   const onMouseMove = (e: MouseEvent) => {
  //     if (isDrawing && currentRectangle) {
  //       const rect = this.svgCanvas.getBoundingClientRect();
  //       const currentX = e.clientX - rect.left;
  //       const currentY = e.clientY - rect.top;
  //       updateRectangle(rectStartPoint[0], rectStartPoint[1], currentX, currentY);
  //     } else if (isResizing) {
  //       const rect = this.svgCanvas.getBoundingClientRect();
  //       const currentX = e.clientX - rect.left;
  //       const currentY = e.clientY - rect.top;
  //       updateRectangleSize(currentX, currentY);
  //     }
  //     else if (isDragging) {
  //       dragRectangle(e);
  //     }
  //   };
  //
  //   const onMouseUp = () => {
  //     if (isDrawing) {
  //       isDrawing = false;
  //     }
  //     if (isDragging) {
  //       isDragging = false;
  //     }
  //     if (isResizing) {
  //       isResizing = false;
  //       resizeDirection = null;
  //     }
  //     this.shapeType = 'cursor';
  //   };
  //
  //
  //   document.getElementById('pointsInput')?.addEventListener('input', (e: Event) => {
  //     const input = e.target as HTMLInputElement;
  //     const value = parseInt(input.value, 10);
  //
  //     if (value >= 3) {
  //       numberOfPoints = value;
  //       if (currentPolygon) {
  //         updatePolygon(); // Update the polygon when number of points changes
  //       }
  //     }
  //   });
  //
  //   let shapeAddListeners = () => {
  //     this.svgCanvas.addEventListener('mousedown', onMouseDown);
  //     this.svgCanvas.addEventListener('mousemove', onMouseMove);
  //     this.svgCanvas.addEventListener('mouseup', onMouseUp);
  //   }
  //
  //   shapeAddListeners();
  //
  //   this.removeListeners = () => {
  //     this.svgCanvas.removeEventListener('mousedown', onMouseDown);
  //     this.svgCanvas.removeEventListener('mousemove', onMouseMove);
  //     this.svgCanvas.removeEventListener('mouseup', onMouseUp);
  //   }
  //
  // }

  // createSquare() {
  //   if (this.removeListeners) {
  //     this.removeListeners();
  //   }
  //   this.shapeType = 'rectangle';
  //   const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
  //   let isDrawing = false;
  //   let startX: number;
  //   let startY: number;
  //   let currentSquare: SVGPolygonElement | null = null;
  //   let currentRectangle: SVGRectElement | null = null;
  //   let isDragging = false;
  //   let isResizing = false;
  //   let handleAdd = false;
  //   let resizeDirection: string | null = null;
  //   let rectStartPoint: [number, number] = [0, 0];
  //   let offsetX: number; // Offset for dragging
  //   let offsetY: number;
  //   let pointsInput: number = 0;
  //
  //
  //   const createRectangle = () => {
  //     pointsInput++;
  //     let rect = document.createElementNS(SVG_NAMESPACE, 'rect');
  //     rect.setAttribute('fill', 'none'); // No fill color
  //     rect.setAttribute('stroke', 'blue'); // Border color
  //     rect.setAttribute('stroke-width', '2');
  //     rect.setAttribute('id', `${pointsInput}`);
  //     rect.style.pointerEvents = 'all'; // Allow pointer events on the entire rectangle
  //     currentRectangle = rect;
  //     this.svgCanvas.appendChild(rect);
  //
  //     rect.addEventListener('click', (e) => {
  //       currentRectangle = rect;
  //       currentSquare = document.getElementById(`${pointsInput}square`) as SVGPolygonElement | null;
  //       rectStartPoint = [
  //         parseFloat(currentRectangle.getAttribute('x') || '0'),
  //         parseFloat(currentRectangle.getAttribute('y') || '0')
  //       ];
  //       updateHandles(); // Update handles when rectangle is clicked
  //       updateSquare(); // Update associated square when rectangle is selected
  //
  //       if (this.removeListeners) {
  //         this.removeListeners();
  //       }
  //
  //       shapeAddListeners();
  //     });
  //
  //     if (!handleAdd) {
  //       addResizeHandles();
  //       handleAdd = true;
  //     }
  //   };
  //
  //   const createSquare = () => {
  //     if (currentRectangle) {
  //       let square = document.createElementNS(SVG_NAMESPACE, 'polygon');
  //       square.setAttribute('fill', 'rgba(0, 123, 255, 0.5)'); // Optional fill color for the square
  //       square.setAttribute('stroke', 'blue'); // Border color for the square
  //       square.setAttribute('stroke-width', '2');
  //       let id = `${pointsInput}square`;
  //       square.setAttribute('id', id);
  //       square.style.pointerEvents = 'none'; // Disable pointer events for the square
  //       this.svgCanvas.appendChild(square);
  //       currentSquare = square;
  //       updateSquare(); // Update the square initially
  //     }
  //   };
  //
  //   const updateSquare = () => {
  //     if (currentRectangle && currentSquare) {
  //       const rectX = parseFloat(currentRectangle.getAttribute('x')!);
  //       const rectY = parseFloat(currentRectangle.getAttribute('y')!);
  //       const width = parseFloat(currentRectangle.getAttribute('width')!);
  //       const height = parseFloat(currentRectangle.getAttribute('height')!);
  //
  //       const margin = 15; // Define the margin between the square and rectangle
  //
  //       const points: [number, number][] = [
  //         [rectX + margin, rectY + margin],
  //         [rectX + width - margin, rectY + margin],
  //         [rectX + width - margin, rectY + height - margin],
  //         [rectX + margin, rectY + height - margin]
  //       ];
  //
  //       const pointsAttr = points.map(point => point.join(',')).join(' ');
  //       if (pointsAttr) {
  //         currentSquare.setAttribute('points', pointsAttr);
  //       }
  //     }
  //   };
  //
  //   const addResizeHandles = () => {
  //     if (currentRectangle) {
  //       const handles = [
  //         { position: 'top-left', cursor: 'nwse-resize' },
  //         { position: 'top-right', cursor: 'nesw-resize' },
  //         { position: 'bottom-left', cursor: 'nesw-resize' },
  //         { position: 'bottom-right', cursor: 'nwse-resize' },
  //         { position: 'top', cursor: 'ns-resize' },
  //         { position: 'bottom', cursor: 'ns-resize' },
  //         { position: 'left', cursor: 'ew-resize' },
  //         { position: 'right', cursor: 'ew-resize' }
  //       ];
  //
  //       handles.forEach(({ position, cursor }) => {
  //         const handle = document.createElementNS(SVG_NAMESPACE, 'rect');
  //         handle.setAttribute('class', `resize-handle resize-${position}`);
  //         handle.setAttribute('fill', 'white');
  //         handle.setAttribute('width', '10');
  //         handle.setAttribute('height', '10');
  //         handle.setAttribute('stroke', 'blue'); // Border color for the ellipse
  //         handle.setAttribute('stroke-width', '2');
  //         handle.setAttribute('cursor', cursor);
  //         handle.setAttribute('data-resize', position);
  //         handle.setAttribute('rx', '2.5'); // Border radius for the handle
  //         handle.setAttribute('ry', '2.5'); // Border radius for the handle
  //         this.svgCanvas.appendChild(handle);
  //       });
  //
  //       // Ensure handles are positioned correctly initially
  //       if (currentRectangle) {
  //         const handles = document.querySelectorAll('.resize-handle');
  //         handles.forEach((handle) => {
  //           handle.setAttribute('fill', 'white');
  //           const svgHandle = handle as SVGRectElement;
  //           const position = svgHandle.getAttribute('data-resize')!;
  //           updateHandlePosition(position);
  //         });
  //       }
  //     }
  //   };
  //
  //   const getAdjustedCoordinates = (e: MouseEvent) => {
  //     const rect = this.svgCanvas.getBoundingClientRect();
  //     return {
  //       x: e.clientX - rect.left + this.body.scrollLeft,
  //       y: e.clientY - rect.top + this.body.scrollTop
  //     };
  //   };
  //
  //   const updateHandlePosition = (position: string) => {
  //     const handle = document.querySelector(`.resize-${position}`) as SVGRectElement;
  //     if (handle && currentRectangle) {
  //       const rect = currentRectangle!;
  //       const rectX = parseFloat(rect.getAttribute('x')!);
  //       const rectY = parseFloat(rect.getAttribute('y')!);
  //       const rectWidth = parseFloat(rect.getAttribute('width')!);
  //       const rectHeight = parseFloat(rect.getAttribute('height')!);
  //
  //       switch (position) {
  //         case 'top-left':
  //           handle.setAttribute('x', (rectX - 5).toString());
  //           handle.setAttribute('y', (rectY - 5).toString());
  //           break;
  //         case 'top-right':
  //           handle.setAttribute('x', (rectX + rectWidth - 5).toString());
  //           handle.setAttribute('y', (rectY - 5).toString());
  //           break;
  //         case 'bottom-left':
  //           handle.setAttribute('x', (rectX - 5).toString());
  //           handle.setAttribute('y', (rectY + rectHeight - 5).toString());
  //           break;
  //         case 'bottom-right':
  //           handle.setAttribute('x', (rectX + rectWidth - 5).toString());
  //           handle.setAttribute('y', (rectY + rectHeight - 5).toString());
  //           break;
  //         case 'top':
  //           handle.setAttribute('x', (rectX + rectWidth / 2 - 5).toString());
  //           handle.setAttribute('y', (rectY - 5).toString());
  //           break;
  //         case 'bottom':
  //           handle.setAttribute('x', (rectX + rectWidth / 2 - 5).toString());
  //           handle.setAttribute('y', (rectY + rectHeight - 5).toString());
  //           break;
  //         case 'left':
  //           handle.setAttribute('x', (rectX - 5).toString());
  //           handle.setAttribute('y', (rectY + rectHeight / 2 - 5).toString());
  //           break;
  //         case 'right':
  //           handle.setAttribute('x', (rectX + rectWidth - 5).toString());
  //           handle.setAttribute('y', (rectY + rectHeight / 2 - 5).toString());
  //           break;
  //       }
  //     }
  //   };
  //
  //   const updateHandles = () => {
  //     // Remove old handles
  //     const oldHandles = document.querySelectorAll('.resize-handle');
  //     oldHandles.forEach(handle => handle.remove());
  //
  //     // Re-add handles
  //     addResizeHandles();
  //   };
  //
  //   const updateRectangle = (startX: number, startY: number, currentX: number, currentY: number) => {
  //     const width = currentX - startX;
  //     const height = currentY - startY;
  //
  //     // Update rectangle's attributes
  //     if (currentRectangle) {
  //       currentRectangle.setAttribute('x', Math.min(startX, currentX).toString());
  //       currentRectangle.setAttribute('y', Math.min(startY, currentY).toString());
  //       currentRectangle.setAttribute('width', Math.abs(width).toString());
  //       currentRectangle.setAttribute('height', Math.abs(height).toString());
  //
  //       // Update handles position
  //       updateHandles();
  //       updateSquare();
  //     }
  //   };
  //
  //   const updateRectangleSize = (e: MouseEvent) => {
  //     if (currentRectangle) {
  //       const adjusted = getAdjustedCoordinates(e); // Get adjusted coordinates
  //
  //       const rectX = parseFloat(currentRectangle.getAttribute('x')!);
  //       const rectY = parseFloat(currentRectangle.getAttribute('y')!);
  //       const width = parseFloat(currentRectangle.getAttribute('width')!);
  //       const height = parseFloat(currentRectangle.getAttribute('height')!);
  //
  //       switch (resizeDirection) {
  //         case 'top-left':
  //           const newTopLeftX = Math.min(adjusted.x, rectX + width);
  //           const newTopLeftY = Math.min(adjusted.y, rectY + height);
  //           const newTopLeftWidth = Math.max(width + (rectX - newTopLeftX), 0);
  //           const newTopLeftHeight = Math.max(height + (rectY - newTopLeftY), 0);
  //
  //           currentRectangle.setAttribute('x', newTopLeftX.toString());
  //           currentRectangle.setAttribute('y', newTopLeftY.toString());
  //           currentRectangle.setAttribute('width', newTopLeftWidth.toString());
  //           currentRectangle.setAttribute('height', newTopLeftHeight.toString());
  //           break;
  //
  //         case 'top-right':
  //           const newTopRightWidth = Math.max(adjusted.x - rectX, 0);
  //           const newTopRightHeight = Math.max(height + (rectY - adjusted.y), 0);
  //
  //           currentRectangle.setAttribute('y', Math.min(adjusted.y, rectY + height).toString());
  //           currentRectangle.setAttribute('width', newTopRightWidth.toString());
  //           currentRectangle.setAttribute('height', newTopRightHeight.toString());
  //           break;
  //
  //         case 'bottom-left':
  //           const newBottomLeftX = Math.min(adjusted.x, rectX + width);
  //           const newBottomLeftWidth = Math.max(width + (rectX - newBottomLeftX), 0);
  //           const newBottomLeftHeight = Math.max(adjusted.y - rectY, 0);
  //
  //           currentRectangle.setAttribute('x', newBottomLeftX.toString());
  //           currentRectangle.setAttribute('width', newBottomLeftWidth.toString());
  //           currentRectangle.setAttribute('height', newBottomLeftHeight.toString());
  //           break;
  //
  //         case 'bottom-right':
  //           const newBottomRightWidth = Math.max(adjusted.x - rectX, 0);
  //           const newBottomRightHeight = Math.max(adjusted.y - rectY, 0);
  //
  //           currentRectangle.setAttribute('width', newBottomRightWidth.toString());
  //           currentRectangle.setAttribute('height', newBottomRightHeight.toString());
  //           break;
  //
  //         case 'top':
  //           const newTopHeight = Math.max(height + (rectY - adjusted.y), 0);
  //
  //           currentRectangle.setAttribute('y', Math.min(adjusted.y, rectY + height).toString());
  //           currentRectangle.setAttribute('height', newTopHeight.toString());
  //           break;
  //
  //         case 'bottom':
  //           const newBottomHeight = Math.max(adjusted.y - rectY, 0);
  //
  //           currentRectangle.setAttribute('height', newBottomHeight.toString());
  //           break;
  //
  //         case 'left':
  //           const newLeftX = Math.min(adjusted.x, rectX + width);
  //           const newLeftWidth = Math.max(width + (rectX - newLeftX), 0);
  //
  //           currentRectangle.setAttribute('x', newLeftX.toString());
  //           currentRectangle.setAttribute('width', newLeftWidth.toString());
  //           break;
  //
  //         case 'right':
  //           const newRightWidth = Math.max(adjusted.x - rectX, 0);
  //
  //           currentRectangle.setAttribute('width', newRightWidth.toString());
  //           break;
  //       }
  //
  //       updateHandles();
  //       updateSquare();
  //     }
  //   };
  //
  //   const startDragging = (e: MouseEvent) => {
  //     if (currentRectangle) {
  //
  //       const adjusted = getAdjustedCoordinates(e);
  //       offsetX = adjusted.x - parseFloat(currentRectangle.getAttribute('x')!);
  //       offsetY = adjusted.y - parseFloat(currentRectangle.getAttribute('y')!);
  //       isDragging = true;
  //       e.stopPropagation(); // Prevent resize logic from interfering
  //     }
  //   };
  //
  //   const handleMouseDown = (e: MouseEvent) => {
  //     const adjusted = getAdjustedCoordinates(e);
  //     if (e.target instanceof SVGRectElement) {
  //       if (e.target.classList.contains('resize-handle')) {
  //         resizeDirection = (e.target as SVGRectElement).getAttribute('data-resize')!;
  //         console.log(resizeDirection);
  //         isResizing = true;
  //       } else {
  //         currentRectangle = e.target as SVGRectElement;
  //         startDragging(e);
  //       }
  //     } else {
  //       startX = adjusted.x;
  //       startY = adjusted.y;
  //
  //       rectStartPoint = [startX, startY];
  //
  //       createRectangle();
  //       createSquare();
  //
  //       isDrawing = true;
  //     }
  //   };
  //
  //   const handleMouseMove = (e: MouseEvent) => {
  //     const adjusted = getAdjustedCoordinates(e);
  //     if (isResizing && resizeDirection) {
  //       updateRectangleSize(e);
  //     } else if (isDragging && currentRectangle) {
  //       const newX = adjusted.x - offsetX;
  //       const newY = adjusted.y - offsetY;
  //       currentRectangle.setAttribute('x', newX.toString());
  //       currentRectangle.setAttribute('y', newY.toString());
  //       updateHandles();
  //       updateSquare();
  //     } else if (isDrawing && currentRectangle) {
  //
  //       updateRectangle(startX, startY,adjusted.x, adjusted.y);
  //     }
  //   };
  //
  //   const handleMouseUp = () => {
  //     isDrawing = false;
  //     isDragging = false;
  //     isResizing = false;
  //     this.shapeType = 'cursor';
  //   };
  //
  //   let shapeAddListeners = () => {
  //     this.svgCanvas.addEventListener('mousedown', handleMouseDown);
  //     this.svgCanvas.addEventListener('mousemove', handleMouseMove);
  //     this.svgCanvas.addEventListener('mouseup', handleMouseUp);
  //   }
  //
  //   shapeAddListeners();
  //
  //   this.removeListeners = () => {
  //     this.svgCanvas.removeEventListener('mousedown', handleMouseDown);
  //     this.svgCanvas.removeEventListener('mousemove', handleMouseMove);
  //     this.svgCanvas.removeEventListener('mouseup', handleMouseUp);
  //   }
  // }

  // createCircle() {
  //   if (this.removeListeners) {
  //     this.removeListeners();
  //   }
  //   this.shapeType = 'ellipse';
  //   const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
  //   let isDrawing = false;
  //   let startX: number;
  //   let startY: number;
  //   let currentEllipse: SVGEllipseElement | null = null;
  //   let currentRectangle: SVGRectElement | null = null;
  //   let isDragging = false;
  //   let isResizing = false;
  //   let handleAdd = false;
  //   let resizeDirection: string | null = null;
  //   let rectStartPoint: [number, number] = [0, 0];
  //   let offsetX: number; // Offset for dragging
  //   let offsetY: number;
  //   let radiusInput: number = 50; // Default radius for the circle
  //
  //   const createRectangle = () => {
  //     let rect = document.createElementNS(SVG_NAMESPACE, 'rect');
  //     rect.setAttribute('fill', 'none'); // No fill color
  //     rect.setAttribute('stroke', 'blue'); // Border color
  //     rect.setAttribute('stroke-width', '2');
  //     rect.setAttribute('id', 'rectangle');
  //     rect.style.pointerEvents = 'all'; // Allow pointer events on the entire rectangle
  //     currentRectangle = rect;
  //     this.svgCanvas.appendChild(rect);
  //
  //     rect.addEventListener('click', (e) => {
  //       currentRectangle = rect;
  //       rectStartPoint = [
  //         parseFloat(currentRectangle.getAttribute('x') || '0'),
  //         parseFloat(currentRectangle.getAttribute('y') || '0')
  //       ];
  //       updateHandles(); // Update handles when rectangle is clicked
  //       updateEllipse(); // Update associated ellipse when rectangle is selected
  //
  //       if (this.removeListeners) {
  //         this.removeListeners();
  //       }
  //
  //       shapeAddListeners();
  //     });
  //
  //     if (!handleAdd) {
  //       addResizeHandles();
  //       handleAdd = true;
  //     }
  //   };
  //
  //   const createEllipse = () => {
  //     if (currentRectangle) {
  //       let ellipse = document.createElementNS(SVG_NAMESPACE, 'ellipse');
  //       ellipse.setAttribute('fill', 'rgba(0, 123, 255, 0.5)'); // Optional fill color for the ellipse
  //       ellipse.setAttribute('stroke', 'blue'); // Border color for the ellipse
  //       ellipse.setAttribute('stroke-width', '2');
  //       ellipse.setAttribute('rx', radiusInput.toString()); // Set the x-radius
  //       ellipse.setAttribute('ry', radiusInput.toString()); // Set the y-radius
  //       ellipse.setAttribute('id', 'ellipse');
  //       ellipse.style.pointerEvents = 'none'; // Disable pointer events for the ellipse
  //       this.svgCanvas.appendChild(ellipse);
  //       currentEllipse = ellipse;
  //       updateEllipse(); // Update the ellipse initially
  //     }
  //   };
  //
  //   const updateEllipse = () => {
  //     if (currentRectangle && currentEllipse) {
  //       const rectX = parseFloat(currentRectangle.getAttribute('x')!);
  //       const rectY = parseFloat(currentRectangle.getAttribute('y')!);
  //       const width = parseFloat(currentRectangle.getAttribute('width')!);
  //       const height = parseFloat(currentRectangle.getAttribute('height')!);
  //
  //       const centerX = rectX + width / 2;
  //       const centerY = rectY + height / 2;
  //       const rx = (width / 2) - 15; // x-radius
  //       const ry = (height / 2) - 15; // y-radius
  //
  //       currentEllipse.setAttribute('cx', centerX.toString());
  //       currentEllipse.setAttribute('cy', centerY.toString());
  //       currentEllipse.setAttribute('rx', rx.toString());
  //       currentEllipse.setAttribute('ry', ry.toString());
  //     }
  //   };
  //
  //   const addResizeHandles = () => {
  //     if (currentRectangle) {
  //       const handles = [
  //         { position: 'top-left', cursor: 'nwse-resize' },
  //         { position: 'top-right', cursor: 'nesw-resize' },
  //         { position: 'bottom-left', cursor: 'nesw-resize' },
  //         { position: 'bottom-right', cursor: 'nwse-resize' },
  //         { position: 'top', cursor: 'ns-resize' },
  //         { position: 'bottom', cursor: 'ns-resize' },
  //         { position: 'left', cursor: 'ew-resize' },
  //         { position: 'right', cursor: 'ew-resize' }
  //       ];
  //
  //       handles.forEach(({ position, cursor }) => {
  //         const handle = document.createElementNS(SVG_NAMESPACE, 'rect');
  //         handle.setAttribute('class', `resize-handle resize-${position}`);
  //         handle.setAttribute('fill', 'white');
  //         handle.setAttribute('width', '10');
  //         handle.setAttribute('height', '10');
  //         handle.setAttribute('stroke', 'blue'); // Border color for the ellipse
  //         handle.setAttribute('stroke-width', '2');
  //         handle.setAttribute('cursor', cursor);
  //         handle.setAttribute('data-resize', position);
  //         handle.setAttribute('rx', '2.5'); // Border radius for the handle
  //         handle.setAttribute('ry', '2.5'); // Border radius for the handle
  //         this.svgCanvas.appendChild(handle);
  //       });
  //
  //       // Ensure handles are positioned correctly initially
  //       if (currentRectangle) {
  //         const handles = document.querySelectorAll('.resize-handle');
  //         handles.forEach((handle) => {
  //           handle.setAttribute('fill', 'white');
  //           const svgHandle = handle as SVGRectElement;
  //           const position = svgHandle.getAttribute('data-resize')!;
  //           updateHandlePosition(position);
  //         });
  //       }
  //     }
  //   };
  //
  //   const updateHandlePosition = (position: string) => {
  //     const handle = document.querySelector(`.resize-${position}`) as SVGRectElement;
  //     if (handle && currentRectangle) {
  //       const rect = currentRectangle!;
  //       const rectX = parseFloat(rect.getAttribute('x')!);
  //       const rectY = parseFloat(rect.getAttribute('y')!);
  //       const rectWidth = parseFloat(rect.getAttribute('width')!);
  //       const rectHeight = parseFloat(rect.getAttribute('height')!);
  //
  //       switch (position) {
  //         case 'top-left':
  //           handle.setAttribute('x', (rectX - 5).toString());
  //           handle.setAttribute('y', (rectY - 5).toString());
  //           break;
  //         case 'top-right':
  //           handle.setAttribute('x', (rectX + rectWidth - 5).toString());
  //           handle.setAttribute('y', (rectY - 5).toString());
  //           break;
  //         case 'bottom-left':
  //           handle.setAttribute('x', (rectX - 5).toString());
  //           handle.setAttribute('y', (rectY + rectHeight - 5).toString());
  //           break;
  //         case 'bottom-right':
  //           handle.setAttribute('x', (rectX + rectWidth - 5).toString());
  //           handle.setAttribute('y', (rectY + rectHeight - 5).toString());
  //           break;
  //         case 'top':
  //           handle.setAttribute('x', (rectX + rectWidth / 2 - 5).toString());
  //           handle.setAttribute('y', (rectY - 5).toString());
  //           break;
  //         case 'bottom':
  //           handle.setAttribute('x', (rectX + rectWidth / 2 - 5).toString());
  //           handle.setAttribute('y', (rectY + rectHeight - 5).toString());
  //           break;
  //         case 'left':
  //           handle.setAttribute('x', (rectX - 5).toString());
  //           handle.setAttribute('y', (rectY + rectHeight / 2 - 5).toString());
  //           break;
  //         case 'right':
  //           handle.setAttribute('x', (rectX + rectWidth - 5).toString());
  //           handle.setAttribute('y', (rectY + rectHeight / 2 - 5).toString());
  //           break;
  //       }
  //     }
  //   };
  //
  //   const updateHandles = () => {
  //     // Remove old handles
  //     const oldHandles = document.querySelectorAll('.resize-handle');
  //     oldHandles.forEach(handle => handle.remove());
  //
  //     // Re-add handles
  //     addResizeHandles();
  //   };
  //
  //   const updateRectangle = (startX: number, startY: number, currentX: number, currentY: number) => {
  //     const width = currentX - startX;
  //     const height = currentY - startY;
  //
  //     // Update rectangle's attributes
  //     if (currentRectangle) {
  //       currentRectangle.setAttribute('x', Math.min(startX, currentX).toString());
  //       currentRectangle.setAttribute('y', Math.min(startY, currentY).toString());
  //       currentRectangle.setAttribute('width', Math.abs(width).toString());
  //       currentRectangle.setAttribute('height', Math.abs(height).toString());
  //
  //       // Update handles position
  //       updateHandles();
  //       updateEllipse();
  //     }
  //   };
  //
  //   const updateRectangleSize = (currentX: number, currentY: number) => {
  //     if (currentRectangle) {
  //       const rectX = parseFloat(currentRectangle.getAttribute('x')!);
  //       const rectY = parseFloat(currentRectangle.getAttribute('y')!);
  //       const width = parseFloat(currentRectangle.getAttribute('width')!);
  //       const height = parseFloat(currentRectangle.getAttribute('height')!);
  //
  //       switch (resizeDirection) {
  //         case 'top-left':
  //           const newTopLeftX = Math.min(currentX, rectX + width);
  //           const newTopLeftY = Math.min(currentY, rectY + height);
  //           const newTopLeftWidth = Math.max(width + (rectX - newTopLeftX), 0);
  //           const newTopLeftHeight = Math.max(height + (rectY - newTopLeftY), 0);
  //
  //           currentRectangle.setAttribute('x', newTopLeftX.toString());
  //           currentRectangle.setAttribute('y', newTopLeftY.toString());
  //           currentRectangle.setAttribute('width', newTopLeftWidth.toString());
  //           currentRectangle.setAttribute('height', newTopLeftHeight.toString());
  //           break;
  //
  //         case 'top-right':
  //           const newTopRightWidth = Math.max(currentX - rectX, 0);
  //           const newTopRightHeight = Math.max(height + (rectY - currentY), 0);
  //
  //           currentRectangle.setAttribute('y', Math.min(currentY, rectY + height).toString());
  //           currentRectangle.setAttribute('width', newTopRightWidth.toString());
  //           currentRectangle.setAttribute('height', newTopRightHeight.toString());
  //           break;
  //
  //         case 'bottom-left':
  //           const newBottomLeftX = Math.min(currentX, rectX + width);
  //           const newBottomLeftWidth = Math.max(width + (rectX - newBottomLeftX), 0);
  //           const newBottomLeftHeight = Math.max(currentY - rectY, 0);
  //
  //           currentRectangle.setAttribute('x', newBottomLeftX.toString());
  //           currentRectangle.setAttribute('width', newBottomLeftWidth.toString());
  //           currentRectangle.setAttribute('height', newBottomLeftHeight.toString());
  //           break;
  //
  //         case 'bottom-right':
  //           const newBottomRightWidth = Math.max(currentX - rectX, 0);
  //           const newBottomRightHeight = Math.max(currentY - rectY, 0);
  //
  //           currentRectangle.setAttribute('width', newBottomRightWidth.toString());
  //           currentRectangle.setAttribute('height', newBottomRightHeight.toString());
  //           break;
  //
  //         case 'top':
  //           const newTopHeight = Math.max(height + (rectY - currentY), 0);
  //
  //           currentRectangle.setAttribute('y', Math.min(currentY, rectY + height).toString());
  //           currentRectangle.setAttribute('height', newTopHeight.toString());
  //           break;
  //
  //         case 'bottom':
  //           const newBottomHeight = Math.max(currentY - rectY, 0);
  //
  //           currentRectangle.setAttribute('height', newBottomHeight.toString());
  //           break;
  //
  //         case 'left':
  //           const newLeftX = Math.min(currentX, rectX + width);
  //           const newLeftWidth = Math.max(width + (rectX - newLeftX), 0);
  //
  //           currentRectangle.setAttribute('x', newLeftX.toString());
  //           currentRectangle.setAttribute('width', newLeftWidth.toString());
  //           break;
  //
  //         case 'right':
  //           const newRightWidth = Math.max(currentX - rectX, 0);
  //
  //           currentRectangle.setAttribute('width', newRightWidth.toString());
  //           break;
  //       }
  //
  //       updateHandles();
  //       updateEllipse();  // Ensure polygon is updated after resizing
  //     }
  //   };
  //
  //   const onMouseDown = (event: MouseEvent) => {
  //     if (event.target === this.svgCanvas) {
  //       isDrawing = true;
  //       startX = event.offsetX;
  //       startY = event.offsetY;
  //       createRectangle();
  //       createEllipse(); // Create ellipse when rectangle is created
  //     } else if (event.target instanceof SVGRectElement) {
  //       if (event.target.getAttribute('id') === 'rectangle') {
  //         isDragging = true;
  //         offsetX = event.offsetX - parseFloat(currentRectangle?.getAttribute('x') || '0');
  //         offsetY = event.offsetY - parseFloat(currentRectangle?.getAttribute('y') || '0');
  //       } else if (event.target.getAttribute('class')?.startsWith('resize-handle')) {
  //         isResizing = true;
  //         resizeDirection = event.target.getAttribute('data-resize')!;
  //       }
  //     }
  //   };
  //
  //   const onMouseMove = (event: MouseEvent) => {
  //     if (isDrawing) {
  //       updateRectangle(startX, startY, event.offsetX, event.offsetY);
  //     } else if (isDragging && currentRectangle) {
  //       const x = event.offsetX - offsetX;
  //       const y = event.offsetY - offsetY;
  //       currentRectangle.setAttribute('x', x.toString());
  //       currentRectangle.setAttribute('y', y.toString());
  //
  //       updateEllipse();
  //       updateHandles();
  //     } else if (isResizing && currentRectangle) {
  //       updateRectangleSize(event.offsetX, event.offsetY);
  //     }
  //   };
  //
  //   const onMouseUp = () => {
  //     isDrawing = false;
  //     isDragging = false;
  //     isResizing = false;
  //     resizeDirection = null;
  //     this.shapeType = 'cursor';
  //   };
  //
  //   let shapeAddListeners = () => {
  //     this.svgCanvas.addEventListener('mousedown', onMouseDown);
  //     this.svgCanvas.addEventListener('mousemove', onMouseMove);
  //     this.svgCanvas.addEventListener('mouseup', onMouseUp);
  //   }
  //
  //   shapeAddListeners();
  //
  //   this.removeListeners = () => {
  //     this.svgCanvas.removeEventListener('mousedown', onMouseDown);
  //     this.svgCanvas.removeEventListener('mousemove', onMouseMove);
  //     this.svgCanvas.removeEventListener('mouseup', onMouseUp);
  //   }
  // }
}
