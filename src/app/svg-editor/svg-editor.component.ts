import {Component, OnInit} from '@angular/core';
import {ElementInfo} from "../../models/element-info";
import {timer} from "rxjs";
import namer from "color-namer";
import chroma from "chroma-js";

@Component({
  selector: 'app-svg-editor',
  templateUrl: './svg-editor.component.html',
  styleUrl: './svg-editor.component.css'
})
export class SvgEditorComponent implements OnInit {
  elements: ElementInfo[] = [];
  strokeColors: string[] = [];
  mainTwo: string[] = [];
  isDrawing = false;
  selectedItemId: any;
  itemSelected!: ElementInfo;
  currentRectangle: SVGRectElement | null = null;
  currentSVGElement: SVGElement | null = null;
  currentInputElement: HTMLElement | null = null;
  SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

  title = 'eazifoto-v2';

  shapeType: 'polygon' | 'rectangle' | 'ellipse' | 'line' | 'single arrow' | 'double arrow' | 'text box' | 'cursor'  = "cursor";
  removeListeners!: (() => void)
  addListeners!: (() => void)


  body!: HTMLDivElement;
  toolBox!: HTMLDivElement;
  svgCanvas!: SVGSVGElement;

  ngOnInit(): void {
    this.body = document.querySelector('#body-drag') as HTMLDivElement;
    this.toolBox = document.querySelector('#toolbox') as HTMLDivElement;
    this.svgCanvas = document.querySelector('#canvas') as SVGSVGElement;
    this.toolBox.addEventListener('click', (e) => {
      e.stopPropagation();
    })
    this.svgCanvas.addEventListener('click', (e) => {
      if (this.isDrawing) {
        return;
      }
      this.currentSVGElement = null;
      this.checkAndRemoveElements();
      if (this.removeListeners) {
        this.removeListeners();
      }
      this.removeHandles();
    })
  }

  checkAndRemoveElements = () => {
    if (this.currentInputElement && this.currentRectangle) {
      const content = this.currentInputElement.textContent?.trim();

      // If the h1 element is empty
      if (!content) {
        // Hide or remove elements
        this.currentInputElement.style.display = 'none'; // Hide the <h1> element
        this.currentRectangle.style.display = 'none'; // Hide the rectangle

        // Optionally, remove elements from DOM if needed
        this.currentInputElement.remove();
        this.currentRectangle.remove();
      } else {
        // Ensure the elements are visible if they contain content
        this.currentInputElement.style.display = '';
        this.currentRectangle.style.display = '';
      }
    }
  };

  removeHandles = () => {
    this.currentRectangle?.setAttribute('stroke', 'transparent');
    const polyHandles = document.querySelectorAll('.resize-handle');
    polyHandles.forEach(handle => handle.remove());
    const oldHandles = document.querySelectorAll('.line-handle');
    oldHandles.forEach(handle => handle.remove());
  }

  IdGen() {
    return 'xxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  polygon() {
    if (this.removeListeners) {
      this.removeListeners();
    }

    this.currentSVGElement = null;
    this.svgCanvas.style.cursor = 'crosshair';
    const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
    let isDrawing = false;
    let startX: number;
    let startY: number;
    let numberOfPoints = 3; // Default to a triangle
    let isDragging = false;
    let isResizing = false;
    let handleAdd = false;
    let resizeDirection: string | null = null;
    let rectStartPoint: [number, number] = [0, 0];
    let offsetX: number; // Offset for dragging
    let offsetY: number;

    const removeHandles = () => {
      this.currentRectangle?.setAttribute('stroke', 'transparent');
      const polyHandles = document.querySelectorAll('.resize-handle');
      polyHandles.forEach(handle => handle.remove());
      const oldHandles = document.querySelectorAll('.line-handle');
      oldHandles.forEach(handle => handle.remove());
    }

    removeHandles();

    const createRectangle = () => {
      let id = this.IdGen();
      let rect = document.createElementNS(this.SVG_NAMESPACE, 'rect') as SVGRectElement;
      rect.setAttribute('fill', 'none'); // No fill color
      rect.setAttribute('stroke', 'transparent'); // Border color
      rect.setAttribute('strokeColor-width', '1');
      rect.setAttribute('id', `${id}main-rect`);
      rect.setAttribute('x', `${startX}`);
      rect.setAttribute('y', `${startY}`);
      rect.style.pointerEvents = 'all';// Allow poi
      this.currentRectangle = rect;
      this.selectedItemId = id;
      this.isDrawing = true;
      this.svgCanvas.appendChild(rect);

      let poly = createPolygon(id);


      rect?.addEventListener('mousedown', (e) => {
        this.polygon();
        this.svgCanvas.style.cursor = 'move';
        this.selectedItemId = id;
        this.currentRectangle = rect;
        this.currentSVGElement = poly;
        this.itemSelected = this.elements.find(element => element.id === id) as ElementInfo;

        updateHandles(); // Update handles when rectangle is clicked
        this.updatePolygon();
      });

      rect.addEventListener('click', (e) => {
        e.stopPropagation();
      })
    };

    const createPolygon = (id: any): SVGElement | null => {
      if (this.currentRectangle) {
        this.itemSelected = {
          fill: "transparent",
          height: 0,
          id: id,
          points: [],
          positonX: startX,
          positonY: startY,
          radius: 0,
          strokeColor: "black",
          strokeWidth: 2,
          type: 'polygon',
          width: 0,
          numberOfPoints: 3
        }

        let poly = document.createElementNS(SVG_NAMESPACE, 'polygon');
        poly.setAttribute('fill', this.itemSelected.fill); // Optional fill color for the polygon
        poly.setAttribute('stroke', this.itemSelected.strokeColor); // Border color for the polygon
        poly.setAttribute('strokeColor-width', this.itemSelected.strokeWidth.toString());
        poly.setAttribute('rx', this.itemSelected.radius.toString()); // Set the x-radius
        poly.setAttribute('ry', this.itemSelected.radius.toString());
        poly.setAttribute('id', `${id}${this.itemSelected.type}`);
        poly.style.pointerEvents = 'none'; // Disable pointer events for the polygon
        this.svgCanvas.appendChild(poly);
        this.currentSVGElement = poly;
        return poly;
      }
      return null;
    };

    // const updatePolygon = () => {
    //   // console.log(this.selectedItemId);
    //   if (this.currentRectangle && this.currentSVGElement) {
    //     const rectX = parseFloat(this.currentRectangle.getAttribute('x')!);
    //     const rectY = parseFloat(this.currentRectangle.getAttribute('y')!);
    //     const width = parseFloat(this.currentRectangle.getAttribute('width')!);
    //     const height = parseFloat(this.currentRectangle.getAttribute('height')!);
    //
    //     const margin = 8; // Define the margin between the polygon and rectangle
    //
    //     const points: [number, number][] = [];
    //     const centerX = rectX + width / 2;
    //     const centerY = rectY + height / 2;
    //
    //     if (numberOfPoints === 3) {
    //       const pointA: [number, number] = [centerX - (width / 2) + margin, centerY + (height / 2) - margin];
    //       const pointB: [number, number] = [centerX + (width / 2) - margin, centerY + (height / 2) - margin];
    //       const pointC: [number, number] = [centerX, centerY - (height / 2) + margin];
    //       points.push(pointA, pointB, pointC);
    //     } else {
    //       // Regular polygon
    //       const radiusX = (width / 2) - margin;
    //       const radiusY = (height / 2) - margin;
    //       const angleStep = (2 * Math.PI) / numberOfPoints;
    //
    //       for (let i = 0; i < numberOfPoints; i++) {
    //         const angle = i * angleStep - Math.PI / 2; // Start from the top
    //         const x = centerX + radiusX * Math.cos(angle);
    //         const y = centerY + radiusY * Math.sin(angle);
    //         points.push([x, y]);
    //       }
    //     }
    //     this.itemSelected.points = points;
    //     const pointsAttr = points.map(point => point.join(',')).join(' ');
    //     if (pointsAttr) {
    //       this.currentSVGElement?.setAttribute('points', pointsAttr);
    //     }
    //   }
    // };

    const addResizeHandles = () => {
      if (this.currentRectangle) {
        const handles = [
          { position: 'top-left', cursor: 'nwse-resize' },
          { position: 'top-right', cursor: 'nesw-resize' },
          { position: 'bottom-left', cursor: 'nesw-resize' },
          { position: 'bottom-right', cursor: 'nwse-resize' },
          { position: 'top', cursor: 'ns-resize' },
          { position: 'bottom', cursor: 'ns-resize' },
          { position: 'left', cursor: 'ew-resize' },
          { position: 'right', cursor: 'ew-resize' }
        ];

        handles.forEach(({ position, cursor }) => {
          const handle = document.createElementNS(SVG_NAMESPACE, 'rect');
          handle.setAttribute('class', `resize-handle resize-${position}`);
          handle.setAttribute('fill', 'white');
          handle.setAttribute('width', '10');
          handle.setAttribute('height', '10');
          handle.setAttribute('stroke', 'blue'); // Border color for the ellipse
          handle.setAttribute('strokeColor-width', '1');
          handle.setAttribute('cursor', cursor);
          handle.setAttribute('data-resize', position);
          handle.setAttribute('rx', '2.5'); // Border radius for the handle
          handle.setAttribute('ry', '2.5'); // Border radius for the handle
          this.svgCanvas.appendChild(handle);
        });

        // Ensure handles are positioned correctly initially
        if (this.currentRectangle) {
          const handles = document.querySelectorAll('.resize-handle');
          handles.forEach((handle) => {
            handle.setAttribute('fill', 'white');
            const svgHandle = handle as SVGRectElement;
            const position = svgHandle.getAttribute('data-resize')!;
            updateHandlePosition(position);
          });
        }
      }
    };

    const updateHandlePosition = (position: string) => {
      const handle = document.querySelector(`.resize-${position}`) as SVGRectElement;
      if (handle && this.currentRectangle) {
        const rect = this.currentRectangle!;
        const rectX = parseFloat(rect.getAttribute('x')!);
        const rectY = parseFloat(rect.getAttribute('y')!);
        const rectWidth = parseFloat(rect.getAttribute('width')!);
        const rectHeight = parseFloat(rect.getAttribute('height')!);

        switch (position) {
          case 'top-left':
            handle.setAttribute('x', (rectX - 5).toString());
            handle.setAttribute('y', (rectY - 5).toString());
            break;
          case 'top-right':
            handle.setAttribute('x', (rectX + rectWidth - 5).toString());
            handle.setAttribute('y', (rectY - 5).toString());
            break;
          case 'bottom-left':
            handle.setAttribute('x', (rectX - 5).toString());
            handle.setAttribute('y', (rectY + rectHeight - 5).toString());
            break;
          case 'bottom-right':
            handle.setAttribute('x', (rectX + rectWidth - 5).toString());
            handle.setAttribute('y', (rectY + rectHeight - 5).toString());
            break;
          case 'top':
            handle.setAttribute('x', (rectX + rectWidth / 2 - 5).toString());
            handle.setAttribute('y', (rectY - 5).toString());
            break;
          case 'bottom':
            handle.setAttribute('x', (rectX + rectWidth / 2 - 5).toString());
            handle.setAttribute('y', (rectY + rectHeight - 5).toString());
            break;
          case 'left':
            handle.setAttribute('x', (rectX - 5).toString());
            handle.setAttribute('y', (rectY + rectHeight / 2 - 5).toString());
            break;
          case 'right':
            handle.setAttribute('x', (rectX + rectWidth - 5).toString());
            handle.setAttribute('y', (rectY + rectHeight / 2 - 5).toString());
            break;
        }
      }
    };

    const updateHandles = () => {
      // Remove old handles
      removeHandles();
      // Re-add handles
      this.currentRectangle?.setAttribute('stroke', 'blue');
      addResizeHandles();
    };

    const updateRectangle = (startX: number, startY: number, currentX: number, currentY: number) => {
      const width = currentX - startX;
      const height = currentY - startY;

      const posX = Math.min(startX, currentX)
      const posY = Math.min(startY, currentY)

      // Update rectangle's attributes
      if (this.currentRectangle) {
        this.itemSelected.positonX = posX;
        this.itemSelected.positonY = posY;
        this.itemSelected.width = width;
        this.itemSelected.height = height;

        this.currentRectangle.setAttribute('x', posX.toString());
        this.currentRectangle.setAttribute('y', posY.toString());
        this.currentRectangle.setAttribute('width', Math.abs(width).toString());
        this.currentRectangle.setAttribute('height', Math.abs(height).toString());

        // Update handles position
        // updateHandles();
        this.updatePolygon();
      }
    };

    const updateRectangleSize = (currentX: number, currentY: number) => {
      if (this.currentRectangle) {
        const rectX = parseFloat(this.currentRectangle.getAttribute('x')!);
        const rectY = parseFloat(this.currentRectangle.getAttribute('y')!);
        const width = parseFloat(this.currentRectangle.getAttribute('width')!);
        const height = parseFloat(this.currentRectangle.getAttribute('height')!);

        switch (resizeDirection) {
          case 'top-left':
            const newTopLeftX = Math.min(currentX, rectX + width);
            const newTopLeftY = Math.min(currentY, rectY + height);
            const newTopLeftWidth = Math.max(width + (rectX - newTopLeftX), 0);
            const newTopLeftHeight = Math.max(height + (rectY - newTopLeftY), 0);

            this.currentRectangle.setAttribute('x', newTopLeftX.toString());
            this.currentRectangle.setAttribute('y', newTopLeftY.toString());
            this.currentRectangle.setAttribute('width', newTopLeftWidth.toString());
            this.currentRectangle.setAttribute('height', newTopLeftHeight.toString());
            break;

          case 'top-right':
            const newTopRightWidth = Math.max(currentX - rectX, 0);
            const newTopRightHeight = Math.max(height + (rectY - currentY), 0);

            this.currentRectangle.setAttribute('y', Math.min(currentY, rectY + height).toString());
            this.currentRectangle.setAttribute('width', newTopRightWidth.toString());
            this.currentRectangle.setAttribute('height', newTopRightHeight.toString());
            break;

          case 'bottom-left':
            const newBottomLeftX = Math.min(currentX, rectX + width);
            const newBottomLeftWidth = Math.max(width + (rectX - newBottomLeftX), 0);
            const newBottomLeftHeight = Math.max(currentY - rectY, 0);

            this.currentRectangle.setAttribute('x', newBottomLeftX.toString());
            this.currentRectangle.setAttribute('width', newBottomLeftWidth.toString());
            this.currentRectangle.setAttribute('height', newBottomLeftHeight.toString());
            break;

          case 'bottom-right':
            const newBottomRightWidth = Math.max(currentX - rectX, 0);
            const newBottomRightHeight = Math.max(currentY - rectY, 0);

            this.currentRectangle.setAttribute('width', newBottomRightWidth.toString());
            this.currentRectangle.setAttribute('height', newBottomRightHeight.toString());
            break;

          case 'top':
            const newTopHeight = Math.max(height + (rectY - currentY), 0);

            this.currentRectangle.setAttribute('y', Math.min(currentY, rectY + height).toString());
            this.currentRectangle.setAttribute('height', newTopHeight.toString());
            break;

          case 'bottom':
            const newBottomHeight = Math.max(currentY - rectY, 0);

            this.currentRectangle.setAttribute('height', newBottomHeight.toString());
            break;

          case 'left':
            const newLeftX = Math.min(currentX, rectX + width);
            const newLeftWidth = Math.max(width + (rectX - newLeftX), 0);

            this.currentRectangle.setAttribute('x', newLeftX.toString());
            this.currentRectangle.setAttribute('width', newLeftWidth.toString());
            break;

          case 'right':
            const newRightWidth = Math.max(currentX - rectX, 0);

            this.currentRectangle.setAttribute('width', newRightWidth.toString());
            break;
        }

        updateHandles();
        this.updatePolygon();  // Ensure polygon is updated after resizing
      }
    };

    const startDragging = (e: MouseEvent) => {
      if (this.currentRectangle) {
        const rect = this.svgCanvas.getBoundingClientRect();
        offsetX = e.clientX - rect.left - parseFloat(this.currentRectangle.getAttribute('x')!);
        offsetY = e.clientY - rect.top - parseFloat(this.currentRectangle.getAttribute('y')!);
        isDragging = true;
        e.stopPropagation(); // Prevent resize logic from interfering
      }
    };

    const dragRectangle = (e: MouseEvent) => {
      if (isDragging && this.currentRectangle) {
        const rect = this.svgCanvas.getBoundingClientRect();
        const newX = e.clientX - rect.left - offsetX;
        const newY = e.clientY - rect.top - offsetY;

        this.currentRectangle.setAttribute('x', newX.toString());
        this.currentRectangle.setAttribute('y', newY.toString());

        updateHandles();
        this.updatePolygon();
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      if (e.target instanceof SVGRectElement) {
        if (e.target.classList.contains('resize-handle')) {
          resizeDirection = (e.target as SVGRectElement).getAttribute('data-resize')!;
          isResizing = true;
        } else {
          // this.currentRectangle = e.target as SVGRectElement;
          startDragging(e);
        }
      } else {
        if (this.shapeType !== 'cursor') {
          if (!this.currentSVGElement) {
            const rect = this.svgCanvas.getBoundingClientRect();
            startX = e.clientX - rect.left;
            startY = e.clientY - rect.top;

            rectStartPoint = [startX, startY];

            createRectangle();
            // createPolygon();
            isDrawing = true;
          }
        }
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDrawing && this.currentRectangle) {
        const rect = this.svgCanvas.getBoundingClientRect();
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;
        updateRectangle(rectStartPoint[0], rectStartPoint[1], startX, startY);
      } else if (isResizing) {
        const rect = this.svgCanvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        updateRectangleSize(currentX, currentY);
      }
      else if (isDragging) {
        dragRectangle(e);
      }
    };

    const onMouseUp = () => {
      if (isDrawing) {
        timer(500).subscribe({
          next: () => {
            this.isDrawing = false;
          }
        });
        isDrawing = false;
        this.currentRectangle?.setAttribute('stroke', 'blue');
        if (!handleAdd) {
          addResizeHandles();
          handleAdd = true;
        } else {
          updateHandles();
        }
      }
      if (isDragging) {
        isDragging = false;
      }
      if (isResizing) {
        isResizing = false;
        resizeDirection = null;
      }
      let getElement = this.elements.find(element => element.id === this.itemSelected?.id);
      if (!getElement) {
        this.elements.push(this.itemSelected);
      } else {

      }
      this.shapeType = 'cursor';
      this.svgCanvas.style.cursor = 'default';
    };

    this.addListeners = () => {
      this.svgCanvas.addEventListener('mousedown', onMouseDown);
      this.svgCanvas.addEventListener('mousemove', onMouseMove);
      this.svgCanvas.addEventListener('mouseup', onMouseUp);
    }

    this.removeListeners = () => {
      this.svgCanvas.removeEventListener('mousedown', onMouseDown);
      this.svgCanvas.removeEventListener('mousemove', onMouseMove);
      this.svgCanvas.removeEventListener('mouseup', onMouseUp);
    }

    this.addListeners();
  }

  rectangle() {
    if (this.removeListeners) {
      this.removeListeners();
    }

    this.currentSVGElement = null;
    this.svgCanvas.style.cursor = 'crosshair';
    const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
    let isDrawing = false;
    let startX: number;
    let startY: number;
    let isDragging = false;
    let isResizing = false;
    let handleAdd = false;
    let resizeDirection: string | null = null;
    let offsetX: number; // Offset for dragging
    let offsetY: number;

    const removeHandles = () => {
      this.currentRectangle?.setAttribute('stroke', 'transparent');
      const polyHandles = document.querySelectorAll('.resize-handle');
      polyHandles.forEach(handle => handle.remove());
      const oldHandles = document.querySelectorAll('.line-handle');
      oldHandles.forEach(handle => handle.remove());
    }


    removeHandles();

    const createRectangle = () => {
      let id = this.IdGen();
      let rect = document.createElementNS(this.SVG_NAMESPACE, 'rect') as SVGRectElement;
      rect.setAttribute('fill', 'none'); // No fill color
      rect.setAttribute('stroke', 'transparent'); // Border color
      rect.setAttribute('strokeColor-width', '1');
      rect.setAttribute('x', `${startX}`);
      rect.setAttribute('y', `${startY}`);
      rect.setAttribute('id', `${id}main-rect`);
      rect.style.pointerEvents = 'all';// Allow poi
      this.currentRectangle = rect;
      this.selectedItemId = id;
      this.isDrawing = true;
      this.svgCanvas.appendChild(rect);
      let poly = createSquare(id);

      rect?.addEventListener('mousedown', (e) => {
        this.rectangle();
        this.svgCanvas.style.cursor = 'move';
        this.selectedItemId = id;
        this.currentRectangle = rect;
        this.currentSVGElement = poly;

        updateSquare();
        updateHandles(); // Update handles when rectangle is clicked
      });

      rect?.addEventListener('click', (e) => {
        e.stopPropagation();
      })
    };

    const createSquare = (id: any): SVGElement | null => {
      if (this.currentRectangle) {
        let square = document.createElementNS(SVG_NAMESPACE, 'polygon');
        square.setAttribute('fill', 'transparent'); // Optional fill color for the square
        square.setAttribute('stroke', 'black'); // Border color for the square
        square.setAttribute('strokeColor-width', '2');
        square.setAttribute('id', `${id}square`);
        square.style.pointerEvents = 'none';
        this.svgCanvas.appendChild(square);
        this.currentSVGElement = square;

        return square
      }
      return null;
    };

    const updateSquare = () => {
      if (this.currentRectangle && this.currentSVGElement) {
        // Ensure the currentSVGElement is the one associated with the currentRectangle

        const rectX = parseFloat(this.currentRectangle.getAttribute('x')!);
        const rectY = parseFloat(this.currentRectangle.getAttribute('y')!);
        const width = parseFloat(this.currentRectangle.getAttribute('width')!);
        const height = parseFloat(this.currentRectangle.getAttribute('height')!);

        const margin = 8; // Define the margin between the square and rectangle

        const points: [number, number][] = [
          [rectX + margin, rectY + margin],
          [rectX + width - margin, rectY + margin],
          [rectX + width - margin, rectY + height - margin],
          [rectX + margin, rectY + height - margin]
        ];

        const pointsAttr = points.map(point => point.join(',')).join(' ');
        if (pointsAttr) {
          this.currentSVGElement.setAttribute('points', pointsAttr);
        }
      }
    };

    const addResizeHandles = () => {
      if (this.currentRectangle) {
        const handles = [
          { position: 'top-left', cursor: 'nwse-resize' },
          { position: 'top-right', cursor: 'nesw-resize' },
          { position: 'bottom-left', cursor: 'nesw-resize' },
          { position: 'bottom-right', cursor: 'nwse-resize' },
          { position: 'top', cursor: 'ns-resize' },
          { position: 'bottom', cursor: 'ns-resize' },
          { position: 'left', cursor: 'ew-resize' },
          { position: 'right', cursor: 'ew-resize' }
        ];

        handles.forEach(({ position, cursor }) => {
          const handle = document.createElementNS(SVG_NAMESPACE, 'rect');
          handle.setAttribute('class', `resize-handle resize-${position}`);
          handle.setAttribute('fill', 'white');
          handle.setAttribute('width', '10');
          handle.setAttribute('height', '10');
          handle.setAttribute('stroke', 'blue'); // Border color for the ellipse
          handle.setAttribute('strokeColor-width', '1');
          handle.setAttribute('cursor', cursor);
          handle.setAttribute('data-resize', position);
          handle.setAttribute('rx', '2.5'); // Border radius for the handle
          handle.setAttribute('ry', '2.5'); // Border radius for the handle
          this.svgCanvas.appendChild(handle);
        });

        // Ensure handles are positioned correctly initially
        if (this.currentRectangle) {
          const handles = document.querySelectorAll('.resize-handle');
          handles.forEach((handle) => {
            handle.setAttribute('fill', 'white');
            const svgHandle = handle as SVGRectElement;
            const position = svgHandle.getAttribute('data-resize')!;
            updateHandlePosition(position);
          });
        }
      }
    };

    const getAdjustedCoordinates = (e: MouseEvent) => {
      const rect = this.svgCanvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const updateHandlePosition = (position: string) => {
      const handle = document.querySelector(`.resize-${position}`) as SVGRectElement;
      if (handle && this.currentRectangle) {
        const rect = this.currentRectangle!;
        const rectX = parseFloat(rect.getAttribute('x')!);
        const rectY = parseFloat(rect.getAttribute('y')!);
        const rectWidth = parseFloat(rect.getAttribute('width')!);
        const rectHeight = parseFloat(rect.getAttribute('height')!);

        switch (position) {
          case 'top-left':
            handle.setAttribute('x', (rectX - 5).toString());
            handle.setAttribute('y', (rectY - 5).toString());
            break;
          case 'top-right':
            handle.setAttribute('x', (rectX + rectWidth - 5).toString());
            handle.setAttribute('y', (rectY - 5).toString());
            break;
          case 'bottom-left':
            handle.setAttribute('x', (rectX - 5).toString());
            handle.setAttribute('y', (rectY + rectHeight - 5).toString());
            break;
          case 'bottom-right':
            handle.setAttribute('x', (rectX + rectWidth - 5).toString());
            handle.setAttribute('y', (rectY + rectHeight - 5).toString());
            break;
          case 'top':
            handle.setAttribute('x', (rectX + rectWidth / 2 - 5).toString());
            handle.setAttribute('y', (rectY - 5).toString());
            break;
          case 'bottom':
            handle.setAttribute('x', (rectX + rectWidth / 2 - 5).toString());
            handle.setAttribute('y', (rectY + rectHeight - 5).toString());
            break;
          case 'left':
            handle.setAttribute('x', (rectX - 5).toString());
            handle.setAttribute('y', (rectY + rectHeight / 2 - 5).toString());
            break;
          case 'right':
            handle.setAttribute('x', (rectX + rectWidth - 5).toString());
            handle.setAttribute('y', (rectY + rectHeight / 2 - 5).toString());
            break;
        }
      }
    };

    const updateHandles = () => {
      // Remove old handles
      removeHandles();
      // Re-add handles
      this.currentRectangle?.setAttribute('stroke', 'blue');
      addResizeHandles();
    };

    const updateRectangle = (startX: number, startY: number, currentX: number, currentY: number) => {
      const width = currentX - startX;
      const height = currentY - startY;

      // Update rectangle's attributes
      if (this.currentRectangle) {
        this.currentRectangle.setAttribute('x', Math.min(startX, currentX).toString());
        this.currentRectangle.setAttribute('y', Math.min(startY, currentY).toString());
        this.currentRectangle.setAttribute('width', Math.abs(width).toString());
        this.currentRectangle.setAttribute('height', Math.abs(height).toString());

        // Update handles position
        // updateHandles();
        updateSquare();
      }
    };

    const updateRectangleSize = (e: MouseEvent) => {
      if (this.currentRectangle) {
        const adjusted = getAdjustedCoordinates(e); // Get adjusted coordinates

        const rectX = parseFloat(this.currentRectangle.getAttribute('x')!);
        const rectY = parseFloat(this.currentRectangle.getAttribute('y')!);
        const width = parseFloat(this.currentRectangle.getAttribute('width')!);
        const height = parseFloat(this.currentRectangle.getAttribute('height')!);

        switch (resizeDirection) {
          case 'top-left':
            const newTopLeftX = Math.min(adjusted.x, rectX + width);
            const newTopLeftY = Math.min(adjusted.y, rectY + height);
            const newTopLeftWidth = Math.max(width + (rectX - newTopLeftX), 0);
            const newTopLeftHeight = Math.max(height + (rectY - newTopLeftY), 0);

            this.currentRectangle.setAttribute('x', newTopLeftX.toString());
            this.currentRectangle.setAttribute('y', newTopLeftY.toString());
            this.currentRectangle.setAttribute('width', newTopLeftWidth.toString());
            this.currentRectangle.setAttribute('height', newTopLeftHeight.toString());
            break;

          case 'top-right':
            const newTopRightWidth = Math.max(adjusted.x - rectX, 0);
            const newTopRightHeight = Math.max(height + (rectY - adjusted.y), 0);

            this.currentRectangle.setAttribute('y', Math.min(adjusted.y, rectY + height).toString());
            this.currentRectangle.setAttribute('width', newTopRightWidth.toString());
            this.currentRectangle.setAttribute('height', newTopRightHeight.toString());
            break;

          case 'bottom-left':
            const newBottomLeftX = Math.min(adjusted.x, rectX + width);
            const newBottomLeftWidth = Math.max(width + (rectX - newBottomLeftX), 0);
            const newBottomLeftHeight = Math.max(adjusted.y - rectY, 0);

            this.currentRectangle.setAttribute('x', newBottomLeftX.toString());
            this.currentRectangle.setAttribute('width', newBottomLeftWidth.toString());
            this.currentRectangle.setAttribute('height', newBottomLeftHeight.toString());
            break;

          case 'bottom-right':
            const newBottomRightWidth = Math.max(adjusted.x - rectX, 0);
            const newBottomRightHeight = Math.max(adjusted.y - rectY, 0);

            this.currentRectangle.setAttribute('width', newBottomRightWidth.toString());
            this.currentRectangle.setAttribute('height', newBottomRightHeight.toString());
            break;

          case 'top':
            const newTopHeight = Math.max(height + (rectY - adjusted.y), 0);

            this.currentRectangle.setAttribute('y', Math.min(adjusted.y, rectY + height).toString());
            this.currentRectangle.setAttribute('height', newTopHeight.toString());
            break;

          case 'bottom':
            const newBottomHeight = Math.max(adjusted.y - rectY, 0);

            this.currentRectangle.setAttribute('height', newBottomHeight.toString());
            break;

          case 'left':
            const newLeftX = Math.min(adjusted.x, rectX + width);
            const newLeftWidth = Math.max(width + (rectX - newLeftX), 0);

            this.currentRectangle.setAttribute('x', newLeftX.toString());
            this.currentRectangle.setAttribute('width', newLeftWidth.toString());
            break;

          case 'right':
            const newRightWidth = Math.max(adjusted.x - rectX, 0);

            this.currentRectangle.setAttribute('width', newRightWidth.toString());
            break;
        }

        updateHandles();
        updateSquare();
      }
    };

    const startDragging = (e: MouseEvent) => {
      if (this.currentRectangle) {
        const adjusted = getAdjustedCoordinates(e);
        offsetX = adjusted.x - parseFloat(this.currentRectangle.getAttribute('x')!);
        offsetY = adjusted.y - parseFloat(this.currentRectangle.getAttribute('y')!);
        isDragging = true;
        e.stopPropagation(); // Prevent resize logic from interfering
      }
    };

    const dragRectangle = (e: MouseEvent) => {
      if (isDragging && this.currentRectangle) {
        const adjusted = getAdjustedCoordinates(e);
        const newX = adjusted.x - offsetX;
        const newY = adjusted.y - offsetY;
        this.currentRectangle.setAttribute('x', newX.toString());
        this.currentRectangle.setAttribute('y', newY.toString());
        updateHandles();
        updateSquare();
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.target instanceof SVGRectElement) {
        if (e.target.classList.contains('resize-handle')) {
          resizeDirection = (e.target as SVGRectElement).getAttribute('data-resize')!;
          isResizing = true;
        } else {
          // this.currentRectangle = e.target as SVGRectElement;
          startDragging(e);
        }
      } else {
        if (this.shapeType !== 'cursor') {
          if (!this.currentSVGElement) {
            const rect = this.svgCanvas.getBoundingClientRect();
            startX = e.clientX - rect.left;
            startY = e.clientY - rect.top;

            createRectangle();
            isDrawing = true;
          }
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const adjusted = getAdjustedCoordinates(e);
      if (isResizing && resizeDirection) {
        updateRectangleSize(e);
      } else if (isDragging) {
        dragRectangle(e);
      } else if (isDrawing && this.currentRectangle) {
        updateRectangle(startX, startY,adjusted.x, adjusted.y);
      }
    };

    const handleMouseUp = () => {
      if (isDrawing) {
        timer(500).subscribe({
          next: () => {
            this.isDrawing = false;
          }
        });
        isDrawing = false;
        this.currentRectangle?.setAttribute('stroke', 'blue');
        if (!handleAdd) {
          addResizeHandles();
          handleAdd = true;
        } else {
          updateHandles();
        }
      }
      if (isDragging) {
        isDragging = false;
      }
      if (isResizing) {
        isResizing = false;
        resizeDirection = null;
      }
      this.shapeType = 'cursor';
      this.svgCanvas.style.cursor = 'default';
    };

    this.addListeners = () => {
      this.svgCanvas.addEventListener('mousedown', handleMouseDown);
      this.svgCanvas.addEventListener('mousemove', handleMouseMove);
      this.svgCanvas.addEventListener('mouseup', handleMouseUp);
    }

    this.removeListeners = () => {
      this.svgCanvas.removeEventListener('mousedown', handleMouseDown);
      this.svgCanvas.removeEventListener('mousemove', handleMouseMove);
      this.svgCanvas.removeEventListener('mouseup', handleMouseUp);
    }

    this.addListeners();
  }

  textbox() {
    if (this.removeListeners) {
      this.removeListeners();
    }

    this.currentSVGElement = null;
    this.svgCanvas.style.cursor = 'crosshair';
    const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
    let isDrawing = false;
    let startX: number;
    let startY: number;
    let isDragging = false;
    let isResizing = false;
    let handleAdd = false;
    let resizeDirection: string | null = null;
    let offsetX: number; // Offset for dragging
    let offsetY: number;

    const removeHandles = () => {
      this.currentRectangle?.setAttribute('stroke', 'transparent');
      const polyHandles = document.querySelectorAll('.resize-handle');
      polyHandles.forEach(handle => handle.remove());
      const oldHandles = document.querySelectorAll('.line-handle');
      oldHandles.forEach(handle => handle.remove());
    }

    removeHandles();

    const createRectangle = () => {
      let id = this.IdGen();
      let rect = document.createElementNS(this.SVG_NAMESPACE, 'rect') as SVGRectElement;
      rect.setAttribute('fill', 'none'); // No fill color
      rect.setAttribute('stroke', 'blue'); // Border color
      rect.setAttribute('strokeColor-width', '1');
      rect.setAttribute('id', `${id}main-rect`);
      rect.style.pointerEvents = 'all';// Allow poi
      this.currentRectangle = rect;
      this.selectedItemId = id;
      this.isDrawing = true;
      this.svgCanvas.appendChild(rect);
      let textInput = createTextInput(id);

      rect?.addEventListener('mousedown', (e) => {
        this.textbox();
        this.svgCanvas.style.cursor = 'move';
        this.selectedItemId = id;
        this.currentRectangle = rect;
        this.currentInputElement = textInput;

        updateTextPosition();
        updateHandles(); // Update handles when rectangle is clicked
      });

      rect?.addEventListener('click', (e) => {
        e.stopPropagation();
      })

      rect.addEventListener('dblclick', () => {
        this.currentInputElement?.focus();
        setCursorToEnd(this.currentInputElement!)
        // Focus on input field when double-clicked
      });

      if (!handleAdd) {
        addResizeHandles();
        handleAdd = true;
      }
    };

    const createTextInput = (id: any): HTMLElement | null => {
      if (this.currentRectangle) {
        let textInput = document.createElement('h1');
        textInput.style.position = 'absolute';
        textInput.style.border = 'none';
        textInput.style.background = 'transparent';
        textInput.style.outline = 'none';
        textInput.style.fontSize = '14px';
        textInput.style.pointerEvents = 'none';
        textInput.style.paddingLeft = '10px';
        textInput.style.paddingRight = '10px';
        textInput.style.lineHeight = '1.1';
        textInput.contentEditable = 'true';
        textInput.id = `${id}textInput`;

        this.currentInputElement = textInput;

        textInput.addEventListener('focus', () => {
          isResizing = false;
          isDrawing = false;// Disable resizing when input is focused
        });
        textInput.addEventListener('blur', () => {
          isResizing = true; // Enable resizing when input is blurred
        });
        textInput.addEventListener('input', () => {
          console.log(this.currentInputElement!.style.height)
          const inputHeight = parseFloat(`${this.currentInputElement?.scrollHeight}`);
          this.currentRectangle?.setAttribute('height', inputHeight.toString());
          updateHandles();
        });
        this.svgCanvas.parentElement?.appendChild(textInput);
        updateTextPosition();
        return textInput;
      }

      return null;
    };

    const updateTextPosition = () => {
      if (this.currentRectangle && this.currentInputElement) {
        const rectX = parseFloat(this.currentRectangle.getAttribute('x')!);
        const rectY = parseFloat(this.currentRectangle.getAttribute('y')!);
        const width = parseFloat(this.currentRectangle.getAttribute('width')!);

        this.currentInputElement.style.left = `${rectX}px`;
        this.currentInputElement.style.top = `${rectY}px`;
        this.currentInputElement.style.width = `${width}px`;

        let newheight = this.currentInputElement?.scrollHeight;
        this.currentRectangle.setAttribute('height', newheight.toString());
      }
    };

    const addResizeHandles = () => {
      if (this.currentRectangle) {
        const handles = [
          { position: 'left', cursor: 'ew-resize' },
          { position: 'right', cursor: 'ew-resize' }
        ];

        handles.forEach(({ position, cursor }) => {
          const handle = document.createElementNS(SVG_NAMESPACE, 'rect');
          handle.setAttribute('class', `resize-handle resize-${position}`);
          handle.setAttribute('fill', 'white');
          handle.setAttribute('width', '10');
          handle.setAttribute('height', '10');
          handle.setAttribute('stroke', 'blue'); // Border color for the ellipse
          handle.setAttribute('strokeColor-width', '1');
          handle.setAttribute('cursor', cursor);
          handle.setAttribute('data-resize', position);
          handle.setAttribute('rx', '2.5'); // Border radius for the handle
          handle.setAttribute('ry', '2.5'); // Border radius for the handle
          this.svgCanvas.appendChild(handle);
        });

        // Ensure handles are positioned correctly initially
        if (this.currentRectangle) {
          const handles = document.querySelectorAll('.resize-handle');
          handles.forEach((handle) => {
            handle.setAttribute('fill', 'white');
            const svgHandle = handle as SVGRectElement;
            const position = svgHandle.getAttribute('data-resize')!;
            updateHandlePosition(position);
          });
        }
      }
    };

    const setCursorToEnd = (element: HTMLElement) => {
      const range = document.createRange();
      const selection = window.getSelection();

      if (element && selection) {
        range.selectNodeContents(element);
        range.collapse(false); // Collapse to the end of the text
        selection.removeAllRanges();
        selection.addRange(range);
      }
    };

    const getAdjustedCoordinates = (e: MouseEvent) => {
      const rect = this.svgCanvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const updateHandlePosition = (position: string) => {
      const handle = document.querySelector(`.resize-${position}`) as SVGRectElement;
      if (handle && this.currentRectangle) {
        const rect = this.currentRectangle!;
        const rectX = parseFloat(rect.getAttribute('x')!);
        const rectY = parseFloat(rect.getAttribute('y')!);
        const rectWidth = parseFloat(rect.getAttribute('width')!);
        const rectHeight = parseFloat(rect.getAttribute('height')!);

        switch (position) {
          case 'left':
            handle.setAttribute('x', (rectX - 5).toString());
            handle.setAttribute('y', (rectY + rectHeight / 2 - 5).toString());
            break;
          case 'right':
            handle.setAttribute('x', (rectX + rectWidth - 5).toString());
            handle.setAttribute('y', (rectY + rectHeight / 2 - 5).toString());
            break;
        }
      }
    };

    const updateHandles = () => {
      // Remove old handles
      removeHandles();
      // Re-add handles
      this.currentRectangle?.setAttribute('stroke', 'blue');
      addResizeHandles();
    };

    const updateRectangle = (startX: number, startY: number, currentX: number, currentY: number) => {
      const width = currentX - startX;

      // Update rectangle's attributes
      if (this.currentRectangle) {
        this.currentRectangle.setAttribute('x', Math.min(startX, currentX).toString());
        this.currentRectangle.setAttribute('y', startY.toString()); // Height is fixed, so y coordinate stays the same
        this.currentRectangle.setAttribute('width', Math.abs(width).toString());
        this.currentRectangle.setAttribute('height', '50'); // Fixed height during draw

        // Update input size to match the rectangle
        if (this.currentInputElement) {
          this.currentInputElement.style.width = '${Math.abs(width)}px';
          this.currentInputElement.style.height = '50px'; // Fixed height during draw

          // Update font size based on fixed height
          this.currentInputElement.style.fontSize = '50px';
        }

        // Update handles position
        updateHandles();
        updateTextPosition();
      }
    };

    const updateRectangleSize = (e: MouseEvent) => {
      if (this.currentRectangle) {
        const adjusted = getAdjustedCoordinates(e); // Get adjusted coordinates

        const rectX = parseFloat(this.currentRectangle.getAttribute('x')!);
        const width = parseFloat(this.currentRectangle.getAttribute('width')!);

        switch (resizeDirection) {
          case 'left':
            const newLeftX = Math.min(adjusted.x, rectX + width);
            const newLeftWidth = Math.max(width + (rectX - newLeftX), 0);

            this.currentRectangle.setAttribute('x', newLeftX.toString());
            this.currentRectangle.setAttribute('width', newLeftWidth.toString());
            break;

          case 'right':
            const newRightWidth = Math.max(adjusted.x - rectX, 0);

            this.currentRectangle.setAttribute('width', newRightWidth.toString());
            break;
        }

        updateHandles();
      }

      updateTextPosition();
    }


    const startDragging = (e: MouseEvent) => {
      if (this.currentRectangle) {
        const adjusted = getAdjustedCoordinates(e);
        offsetX = adjusted.x - parseFloat(this.currentRectangle.getAttribute('x')!);
        offsetY = adjusted.y - parseFloat(this.currentRectangle.getAttribute('y')!);
        isDragging = true;
        e.stopPropagation(); // Prevent resize logic from interfering
      }
    };

    const dragRectangle = (e: MouseEvent) => {
      if (isDragging && this.currentRectangle) {
        const adjusted = getAdjustedCoordinates(e);
        const newX = adjusted.x - offsetX;
        const newY = adjusted.y - offsetY;
        this.currentRectangle.setAttribute('x', newX.toString());
        this.currentRectangle.setAttribute('y', newY.toString());
        updateHandles();
        updateTextPosition();
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.target instanceof SVGRectElement) {
        if (e.target.classList.contains('resize-handle')) {
          resizeDirection = (e.target as SVGRectElement).getAttribute('data-resize')!;
          isResizing = true;
        } else {
          // this.currentRectangle = e.target as SVGRectElement;
          startDragging(e);
        }
      } else {
        if (this.shapeType !== 'cursor') {
          if (!this.currentSVGElement) {
            const rect = this.svgCanvas.getBoundingClientRect();
            startX = e.clientX - rect.left;
            startY = e.clientY - rect.top;

            createRectangle();
            isDrawing = true;
          }
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const adjusted = getAdjustedCoordinates(e);
      if (isResizing && resizeDirection) {
        updateRectangleSize(e);
      } else if (isDragging) {
        dragRectangle(e);
      } else if (isDrawing && this.currentRectangle) {
        updateRectangle(startX, startY,adjusted.x, adjusted.y);
      }
    };

    const handleMouseUp = () => {
      if (isDrawing) {
        timer(500).subscribe({
          next: () => {
            this.isDrawing = false;
          }
        });
        isDrawing = false;
        this.currentInputElement?.focus();
        this.currentRectangle?.setAttribute('stroke', 'blue');
        if (!handleAdd) {
          addResizeHandles();
          handleAdd = true;
        } else {
          updateHandles();
        }
      }
      if (isDragging) {
        isDragging = false;
      }
      if (isResizing) {
        isResizing = false;
        resizeDirection = null;
      }
      this.shapeType = 'cursor';
      this.svgCanvas.style.cursor = 'default';
    };

    this.addListeners = () => {
      this.svgCanvas.addEventListener('mousedown', handleMouseDown);
      this.svgCanvas.addEventListener('mousemove', handleMouseMove);
      this.svgCanvas.addEventListener('mouseup', handleMouseUp);
    }

    this.removeListeners = () => {
      this.svgCanvas.removeEventListener('mousedown', handleMouseDown);
      this.svgCanvas.removeEventListener('mousemove', handleMouseMove);
      this.svgCanvas.removeEventListener('mouseup', handleMouseUp);
    }

    this.addListeners();
  }

  ellipse() {
    if (this.removeListeners) {
      this.removeListeners();
    }

    this.currentSVGElement = null;
    this.svgCanvas.style.cursor = 'crosshair';
    const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
    let isDrawing = false;
    let startX: number;
    let startY: number;
    let isDragging = false;
    let isResizing = false;
    let handleAdd = false;
    let resizeDirection: string | null = null;
    let rectStartPoint: [number, number] = [0, 0];
    let offsetX: number; // Offset for dragging
    let offsetY: number;
    let radiusInput: number = 50; // Default radius for the circle

    const removeHandles = () => {
      this.currentRectangle?.setAttribute('stroke', 'transparent');
      const polyHandles = document.querySelectorAll('.resize-handle');
      polyHandles.forEach(handle => handle.remove());
      const oldHandles = document.querySelectorAll('.line-handle');
      oldHandles.forEach(handle => handle.remove());
    }

    removeHandles();

    const createRectangle = () => {
      let id = this.IdGen();
      let rect = document.createElementNS(SVG_NAMESPACE, 'rect') as SVGRectElement;
      rect.setAttribute('fill', 'none'); // No fill color
      rect.setAttribute('stroke', 'transparent'); // Border color
      rect.setAttribute('strokeColor-width', '1');
      rect.setAttribute('x', `${startX}`);
      rect.setAttribute('y', `${startY}`);
      rect.setAttribute('id', `${id}main-rect`);
      rect.style.pointerEvents = 'all'; // Allow pointer events on the entire rectangle
      this.currentRectangle = rect;
      this.selectedItemId = id;
      this.isDrawing = true;
      this.svgCanvas.appendChild(rect);
      let poly = createEllipse(id);

      rect.addEventListener('mousedown', (e) => {
        this.ellipse();
        this.svgCanvas.style.cursor = 'move';
        this.selectedItemId = id;
        this.currentRectangle = rect;
        this.currentSVGElement = poly;

        updateHandles(); // Update handles when rectangle is clicked
        updateEllipse(); // Update associated ellipse when rectangle is selected

      });

      rect.addEventListener('click', (e) => {
        e.stopPropagation();
      })
    };

    const createEllipse = (id: any): SVGElement | null => {
      if (this.currentRectangle) {
        let ellipse = document.createElementNS(SVG_NAMESPACE, 'ellipse');
        ellipse.setAttribute('fill', 'transparent'); // Optional fill color for the ellipse
        ellipse.setAttribute('stroke', 'black'); // Border color for the ellipse
        ellipse.setAttribute('strokeColor-width', '2');
        ellipse.setAttribute('rx', radiusInput.toString()); // Set the x-radius
        ellipse.setAttribute('ry', radiusInput.toString()); // Set the y-radius
        ellipse.setAttribute('id', `${id}ellipse`);
        ellipse.style.pointerEvents = 'none'; // Disable pointer events for the ellipse
        this.svgCanvas.appendChild(ellipse);
        this.currentSVGElement = ellipse;

        return ellipse;
      }
      return null;
    };

    const updateEllipse = () => {
      if (this.currentRectangle && this.currentSVGElement) {
        const rectX = parseFloat(this.currentRectangle.getAttribute('x')!);
        const rectY = parseFloat(this.currentRectangle.getAttribute('y')!);
        const width = parseFloat(this.currentRectangle.getAttribute('width')!);
        const height = parseFloat(this.currentRectangle.getAttribute('height')!);

        const centerX = rectX + width / 2;
        const centerY = rectY + height / 2;
        const rx = Math.abs((width / 2) - 8); // x-radius
        const ry = Math.abs((height / 2) - 8); // y-radius

        this.currentSVGElement?.setAttribute('cx', centerX.toString());
        this.currentSVGElement?.setAttribute('cy', centerY.toString());
        this.currentSVGElement?.setAttribute('rx', rx.toString());
        this.currentSVGElement?.setAttribute('ry', ry.toString());
      }
    };

    const addResizeHandles = () => {
      if (this.currentRectangle) {
        const handles = [
          { position: 'top-left', cursor: 'nwse-resize' },
          { position: 'top-right', cursor: 'nesw-resize' },
          { position: 'bottom-left', cursor: 'nesw-resize' },
          { position: 'bottom-right', cursor: 'nwse-resize' },
          { position: 'top', cursor: 'ns-resize' },
          { position: 'bottom', cursor: 'ns-resize' },
          { position: 'left', cursor: 'ew-resize' },
          { position: 'right', cursor: 'ew-resize' }
        ];

        handles.forEach(({ position, cursor }) => {
          const handle = document.createElementNS(SVG_NAMESPACE, 'rect');
          handle.setAttribute('class', `resize-handle resize-${position}`);
          handle.setAttribute('fill', 'white');
          handle.setAttribute('width', '10');
          handle.setAttribute('height', '10');
          handle.setAttribute('stroke', 'blue'); // Border color for the ellipse
          handle.setAttribute('strokeColor-width', '1');
          handle.setAttribute('cursor', cursor);
          handle.setAttribute('data-resize', position);
          handle.setAttribute('rx', '2.5'); // Border radius for the handle
          handle.setAttribute('ry', '2.5'); // Border radius for the handle
          this.svgCanvas.appendChild(handle);
        });

        // Ensure handles are positioned correctly initially
        if (this.currentRectangle) {
          const handles = document.querySelectorAll('.resize-handle');
          handles.forEach((handle) => {
            handle.setAttribute('fill', 'white');
            const svgHandle = handle as SVGRectElement;
            const position = svgHandle.getAttribute('data-resize')!;
            updateHandlePosition(position);
          });
        }
      }
    };

    const updateHandlePosition = (position: string) => {
      const handle = document.querySelector(`.resize-${position}`) as SVGRectElement;
      if (handle && this.currentRectangle) {
        const rect = this.currentRectangle!;
        const rectX = parseFloat(rect.getAttribute('x')!);
        const rectY = parseFloat(rect.getAttribute('y')!);
        const rectWidth = parseFloat(rect.getAttribute('width')!);
        const rectHeight = parseFloat(rect.getAttribute('height')!);

        switch (position) {
          case 'top-left':
            handle.setAttribute('x', (rectX - 5).toString());
            handle.setAttribute('y', (rectY - 5).toString());
            break;
          case 'top-right':
            handle.setAttribute('x', (rectX + rectWidth - 5).toString());
            handle.setAttribute('y', (rectY - 5).toString());
            break;
          case 'bottom-left':
            handle.setAttribute('x', (rectX - 5).toString());
            handle.setAttribute('y', (rectY + rectHeight - 5).toString());
            break;
          case 'bottom-right':
            handle.setAttribute('x', (rectX + rectWidth - 5).toString());
            handle.setAttribute('y', (rectY + rectHeight - 5).toString());
            break;
          case 'top':
            handle.setAttribute('x', (rectX + rectWidth / 2 - 5).toString());
            handle.setAttribute('y', (rectY - 5).toString());
            break;
          case 'bottom':
            handle.setAttribute('x', (rectX + rectWidth / 2 - 5).toString());
            handle.setAttribute('y', (rectY + rectHeight - 5).toString());
            break;
          case 'left':
            handle.setAttribute('x', (rectX - 5).toString());
            handle.setAttribute('y', (rectY + rectHeight / 2 - 5).toString());
            break;
          case 'right':
            handle.setAttribute('x', (rectX + rectWidth - 5).toString());
            handle.setAttribute('y', (rectY + rectHeight / 2 - 5).toString());
            break;
        }
      }
    };

    const updateHandles = () => {
      // Remove old handles
      removeHandles();
      // Re-add handles
      this.currentRectangle?.setAttribute('stroke', 'blue');
      // Re-add handles
      addResizeHandles();
    };

    const updateRectangle = (startX: number, startY: number, currentX: number, currentY: number) => {
      const width = currentX - startX;
      const height = currentY - startY;

      // Update rectangle's attributes
      if (this.currentRectangle) {
        this.currentRectangle.setAttribute('x', Math.min(startX, currentX).toString());
        this.currentRectangle.setAttribute('y', Math.min(startY, currentY).toString());
        this.currentRectangle.setAttribute('width', Math.abs(width).toString());
        this.currentRectangle.setAttribute('height', Math.abs(height).toString());

        // Update handles position
        updateEllipse();
      }
    };

    const updateRectangleSize = (currentX: number, currentY: number) => {
      if (this.currentRectangle) {
        const rectX = parseFloat(this.currentRectangle.getAttribute('x')!);
        const rectY = parseFloat(this.currentRectangle.getAttribute('y')!);
        const width = parseFloat(this.currentRectangle.getAttribute('width')!);
        const height = parseFloat(this.currentRectangle.getAttribute('height')!);

        switch (resizeDirection) {
          case 'top-left':
            const newTopLeftX = Math.min(currentX, rectX + width);
            const newTopLeftY = Math.min(currentY, rectY + height);
            const newTopLeftWidth = Math.max(width + (rectX - newTopLeftX), 0);
            const newTopLeftHeight = Math.max(height + (rectY - newTopLeftY), 0);

            this.currentRectangle.setAttribute('x', newTopLeftX.toString());
            this.currentRectangle.setAttribute('y', newTopLeftY.toString());
            this.currentRectangle.setAttribute('width', newTopLeftWidth.toString());
            this.currentRectangle.setAttribute('height', newTopLeftHeight.toString());
            break;

          case 'top-right':
            const newTopRightWidth = Math.max(currentX - rectX, 0);
            const newTopRightHeight = Math.max(height + (rectY - currentY), 0);

            this.currentRectangle.setAttribute('y', Math.min(currentY, rectY + height).toString());
            this.currentRectangle.setAttribute('width', newTopRightWidth.toString());
            this.currentRectangle.setAttribute('height', newTopRightHeight.toString());
            break;

          case 'bottom-left':
            const newBottomLeftX = Math.min(currentX, rectX + width);
            const newBottomLeftWidth = Math.max(width + (rectX - newBottomLeftX), 0);
            const newBottomLeftHeight = Math.max(currentY - rectY, 0);

            this.currentRectangle.setAttribute('x', newBottomLeftX.toString());
            this.currentRectangle.setAttribute('width', newBottomLeftWidth.toString());
            this.currentRectangle.setAttribute('height', newBottomLeftHeight.toString());
            break;

          case 'bottom-right':
            const newBottomRightWidth = Math.max(currentX - rectX, 0);
            const newBottomRightHeight = Math.max(currentY - rectY, 0);

            this.currentRectangle.setAttribute('width', newBottomRightWidth.toString());
            this.currentRectangle.setAttribute('height', newBottomRightHeight.toString());
            break;

          case 'top':
            const newTopHeight = Math.max(height + (rectY - currentY), 0);

            this.currentRectangle.setAttribute('y', Math.min(currentY, rectY + height).toString());
            this.currentRectangle.setAttribute('height', newTopHeight.toString());
            break;

          case 'bottom':
            const newBottomHeight = Math.max(currentY - rectY, 0);

            this.currentRectangle.setAttribute('height', newBottomHeight.toString());
            break;

          case 'left':
            const newLeftX = Math.min(currentX, rectX + width);
            const newLeftWidth = Math.max(width + (rectX - newLeftX), 0);

            this.currentRectangle.setAttribute('x', newLeftX.toString());
            this.currentRectangle.setAttribute('width', newLeftWidth.toString());
            break;

          case 'right':
            const newRightWidth = Math.max(currentX - rectX, 0);

            this.currentRectangle.setAttribute('width', newRightWidth.toString());
            break;
        }

        updateHandles();
        updateEllipse();  // Ensure polygon is updated after resizing
      }
    };

    const startDragging = (e: MouseEvent) => {
      if (this.currentRectangle) {
        const rect = this.svgCanvas.getBoundingClientRect();
        offsetX = e.clientX - rect.left - parseFloat(this.currentRectangle.getAttribute('x')!);
        offsetY = e.clientY - rect.top - parseFloat(this.currentRectangle.getAttribute('y')!);
        isDragging = true;
        e.stopPropagation(); // Prevent resize logic from interfering
      }
    };

    const dragRectangle = (e: MouseEvent) => {
      if (isDragging && this.currentRectangle) {
        const rect = this.svgCanvas.getBoundingClientRect();
        const newX = e.clientX - rect.left - offsetX;
        const newY = e.clientY - rect.top - offsetY;

        this.currentRectangle.setAttribute('x', newX.toString());
        this.currentRectangle.setAttribute('y', newY.toString());

        updateHandles();
        updateEllipse();
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      if (e.target instanceof SVGRectElement) {
        if (e.target.classList.contains('resize-handle')) {
          resizeDirection = (e.target as SVGRectElement).getAttribute('data-resize')!;
          isResizing = true;
        } else {
          startDragging(e);
        }
      } else {
        if (this.shapeType !== 'cursor') {
          if (!this.currentSVGElement) {
            const rect = this.svgCanvas.getBoundingClientRect();
            startX = e.clientX - rect.left;
            startY = e.clientY - rect.top;

            rectStartPoint = [startX, startY];

            createRectangle();
            isDrawing = true;
          }
        }
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      if (isDrawing && this.currentRectangle) {
        const rect = this.svgCanvas.getBoundingClientRect();
        const currentX = event.clientX - rect.left;
        const currentY = event.clientY - rect.top;
        updateRectangle(rectStartPoint[0], rectStartPoint[1], currentX, currentY);
      } else if (isDragging && this.currentRectangle) {
        dragRectangle(event);
      } else if (isResizing && this.currentRectangle) {
        const rect = this.svgCanvas.getBoundingClientRect();
        const currentX = event.clientX - rect.left;
        const currentY = event.clientY - rect.top;
        updateRectangleSize(currentX, currentY);
      }
    };

    const onMouseUp = () => {
      if (isDrawing) {
        timer(500).subscribe({
          next: () => {
            this.isDrawing = false;
          }
        });
        isDrawing = false;
        this.currentRectangle?.setAttribute('stroke', 'blue');
        if (!handleAdd) {
          addResizeHandles();
          handleAdd = true;
        } else {
          updateHandles();
        }
      }
      if (isDragging) {
        isDragging = false;
      }
      if (isResizing) {
        isResizing = false;
        resizeDirection = null;
      }
      this.shapeType = 'cursor';
      this.svgCanvas.style.cursor = 'default';
    };

    this.addListeners = () => {
      this.svgCanvas.addEventListener('mousedown', onMouseDown);
      this.svgCanvas.addEventListener('mousemove', onMouseMove);
      this.svgCanvas.addEventListener('mouseup', onMouseUp);
    }

    this.removeListeners = () => {
      this.svgCanvas.removeEventListener('mousedown', onMouseDown);
      this.svgCanvas.removeEventListener('mousemove', onMouseMove);
      this.svgCanvas.removeEventListener('mouseup', onMouseUp);
    }

    this.addListeners();
  }

  line() {
    if (this.removeListeners) {
      this.removeListeners();
    }

    this.currentSVGElement = null;
    this.svgCanvas.style.cursor = 'crosshair';
    const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
    let isDrawing = false;
    let isDragging = false;
    let isResizing = false;
    let activeHandle: SVGCircleElement | null = null;
    let offsetX: number;
    let offsetY: number;
    let startX: number;
    let startY: number;
    let handleAdd = false;

    const removeHandles = () => {
      this.currentRectangle?.setAttribute('stroke', 'transparent');
      const polyHandles = document.querySelectorAll('.resize-handle');
      polyHandles.forEach(handle => handle.remove());
      const oldHandles = document.querySelectorAll('.line-handle');
      oldHandles.forEach(handle => handle.remove());
    }

    removeHandles();

    const createLine = () => {
      let id = this.IdGen();
      let line = document.createElementNS(SVG_NAMESPACE, 'line');
      line.setAttribute('stroke', 'black'); // Line color
      line.setAttribute('strokeColor-width', '2');
      line.setAttribute('id', `${id}line`);
      line.style.pointerEvents = 'all'; // Allow pointer events for dragging
      line.style.cursor = 'move';
      this.currentSVGElement = line;

      this.currentSVGElement.setAttribute('x1', startX.toString());
      this.currentSVGElement.setAttribute('y1', startY.toString());
      this.currentSVGElement.setAttribute('x2', startX.toString());
      this.currentSVGElement.setAttribute('y2', startY.toString());
      this.selectedItemId = id;
      this.isDrawing = true;
      this.svgCanvas.appendChild(line);

      // Create resizing handles

      // Add event listener for dragging
      line.addEventListener('mousedown', (e) => {
        this.line();
        this.selectedItemId = id;
        this.currentSVGElement = line;
        startDragging(e);

        updateHandles();
      });

      line.addEventListener('click', (e) => {
        e.stopPropagation();
      })

      if (!handleAdd) {
        createHandles();
        handleAdd = true;
      }
    };

    const createHandles = () => {
      const handle1 = document.createElementNS(SVG_NAMESPACE, 'circle');
      const handle2 = document.createElementNS(SVG_NAMESPACE, 'circle');

      handle1.setAttribute('r', '5');
      handle2.setAttribute('r', '5');
      handle1.setAttribute('fill', 'white');
      handle2.setAttribute('fill', 'white');
      handle1.setAttribute('stroke', 'blue'); // Border color for the ellipse
      handle2.setAttribute('stroke', 'blue');
      handle1.setAttribute('strokeColor-width', '1');
      handle2.setAttribute('strokeColor-width', '1');
      handle1.setAttribute('class', 'line-handle');
      handle2.setAttribute('class', 'line-handle');

      handle1.style.cursor = 'pointer';
      handle2.style.cursor = 'pointer';

      // Set handle IDs for reference
      handle1.setAttribute('id', `line-handle1`);
      handle2.setAttribute('id', `line-handle2`);

      this.svgCanvas.appendChild(handle1);
      this.svgCanvas.appendChild(handle2);

      handle1.addEventListener('mousedown', (e) => startResizing(e, this.currentSVGElement!));
      handle2.addEventListener('mousedown', (e) => startResizing(e, this.currentSVGElement!));
      handle2.addEventListener('click', (e) => {
        e.stopPropagation();
      });

      handle1.addEventListener('click', (e) => {
        e.stopPropagation();
      });
      updateHandlePosition();
    };

    const startResizing = (e: MouseEvent, handle: SVGElement) => {
      isResizing = true;
      this.currentSVGElement = handle;
      // e.stopPropagation(); // Prevent other events from interfering
    };

    const updateHandles = () => {
      removeHandles();

      createHandles();
    };

    const updateHandlePosition = () => {
      const handle1 = document.getElementById(`line-handle1`) as unknown as SVGCircleElement;
      const handle2 = document.getElementById(`line-handle2`) as unknown as SVGCircleElement;
      handle1.setAttribute('cx', this.currentSVGElement?.getAttribute('x1')!);
      handle1.setAttribute('cy', this.currentSVGElement?.getAttribute('y1')!);
      handle2.setAttribute('cx', this.currentSVGElement?.getAttribute('x2')!);
      handle2.setAttribute('cy', this.currentSVGElement?.getAttribute('y2')!);
    }

    const updateLine = (startX: number, startY: number, currentX: number, currentY: number) => {
      if (this.currentSVGElement) {
        this.currentSVGElement.setAttribute('x1', startX.toString());
        this.currentSVGElement.setAttribute('y1', startY.toString());
        this.currentSVGElement.setAttribute('x2', currentX.toString());
        this.currentSVGElement.setAttribute('y2', currentY.toString());

        updateHandlePosition();
      }
    };

    const getAdjustedCoordinates = (e: MouseEvent) => {
      const rect = this.svgCanvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const startDragging = (e: MouseEvent) => {
      if (this.currentSVGElement && !isResizing) {
        console.log('start drag 1')
        const adjusted = getAdjustedCoordinates(e);
        offsetX = adjusted.x - parseFloat(this.currentSVGElement.getAttribute('x1')!);
        offsetY = adjusted.y - parseFloat(this.currentSVGElement.getAttribute('y1')!);
        isDragging = true;
      }
    };

    const dragLine = (e: MouseEvent) => {
      if (isDragging && this.currentSVGElement) {
        const adjusted = getAdjustedCoordinates(e);
        const deltaX = adjusted.x - offsetX;
        const deltaY = adjusted.y - offsetY;
        const x1 = deltaX;
        const y1 = deltaY;
        const x2 = x1 + (parseFloat(this.currentSVGElement.getAttribute('x2')!) - parseFloat(this.currentSVGElement.getAttribute('x1')!));
        const y2 = y1 + (parseFloat(this.currentSVGElement.getAttribute('y2')!) - parseFloat(this.currentSVGElement.getAttribute('y1')!));

        this.currentSVGElement.setAttribute('x1', x1.toString());
        this.currentSVGElement.setAttribute('y1', y1.toString());
        this.currentSVGElement.setAttribute('x2', x2.toString());
        this.currentSVGElement.setAttribute('y2', y2.toString());

        // Update handles after dragging
        updateHandlePosition();
      }
    };

    const resizeLine = (e: MouseEvent) => {
      if (isResizing && this.currentSVGElement && activeHandle) {
        const adjusted = getAdjustedCoordinates(e);

        if (activeHandle.id.includes('handle1')) {
          this.currentSVGElement.setAttribute('x1', adjusted.x.toString());
          this.currentSVGElement.setAttribute('y1', adjusted.y.toString());
        } else {
          this.currentSVGElement.setAttribute('x2', adjusted.x.toString());
          this.currentSVGElement.setAttribute('y2', adjusted.y.toString());
        }
        updateHandlePosition();
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.target instanceof SVGCircleElement) {
        isResizing = true;
        isDragging = false;
        activeHandle = e.target as SVGCircleElement;
      }
      if (e.target instanceof SVGLineElement) {
        console.log('start drag')
        startDragging(e);
      }
      else {
        if (this.shapeType !== 'cursor') {
          if (!this.currentSVGElement) {
            const rect = this.svgCanvas.getBoundingClientRect();
            startX = e.clientX - rect.left;
            startY = e.clientY - rect.top;

            createLine();
            isDrawing = true;
          }
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        console.log('do we drag');
        dragLine(e);
      } else if (isResizing) {
        console.log('do we resize');
        resizeLine(e);
      } else if (isDrawing && this.currentSVGElement) {
        const adjusted = getAdjustedCoordinates(e);
        updateLine(startX, startY, adjusted.x, adjusted.y);
      }
    };

    const handleMouseUp = () => {
      if (isDrawing) {
        timer(500).subscribe({
          next: () => {
            this.isDrawing = false;
          }
        });
        isDrawing = false;
      }
      if (isDragging) {
        isDragging = false;
        // Update handles to match the line's new position
        updateHandlePosition();
      }
      if (isResizing) {
        isResizing = false;
        activeHandle = null;
      }
      this.shapeType = 'cursor';
      this.svgCanvas.style.cursor = 'default';
    };

    this.addListeners = () => {
      this.svgCanvas.addEventListener('mousedown', handleMouseDown);
      this.svgCanvas.addEventListener('mousemove', handleMouseMove);
      this.svgCanvas.addEventListener('mouseup', handleMouseUp);
    };

    this.removeListeners = () => {
      this.svgCanvas.removeEventListener('mousedown', handleMouseDown);
      this.svgCanvas.removeEventListener('mousemove', handleMouseMove);
      this.svgCanvas.removeEventListener('mouseup', handleMouseUp);
    };

    this.addListeners();
  }

  singleArrowLine() {
    if (this.removeListeners) {
      this.removeListeners();
    }

    this.currentSVGElement = null;
    this.svgCanvas.style.cursor = 'crosshair';
    const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
    let isDrawing = false;
    let isDragging = false;
    let isResizing = false;
    let activeHandle: SVGCircleElement | null = null;
    let offsetX: number;
    let offsetY: number;
    let startX: number;
    let startY: number;
    let handleAdd = false;

    const removeHandles = () => {
      this.currentRectangle?.setAttribute('stroke', 'transparent');
      const polyHandles = document.querySelectorAll('.resize-handle');
      polyHandles.forEach(handle => handle.remove());
      const oldHandles = document.querySelectorAll('.line-handle');
      oldHandles.forEach(handle => handle.remove());
    }

    const createLine = () => {
      let id = this.IdGen();
      let line = document.createElementNS(SVG_NAMESPACE, 'line');
      line.setAttribute('stroke', 'black'); // Line color
      line.setAttribute('strokeColor-width', '2');
      line.setAttribute('id', `${id}line`);
      line.style.pointerEvents = 'all'; // Allow pointer events for dragging
      line.style.cursor = 'move';
      this.currentSVGElement = line;
      this.currentSVGElement.setAttribute('x1', startX.toString());
      this.currentSVGElement.setAttribute('y1', startY.toString());
      this.currentSVGElement.setAttribute('x2', startX.toString());
      this.currentSVGElement.setAttribute('y2', startY.toString());
      this.selectedItemId = id;
      this.isDrawing = true;
      this.svgCanvas.appendChild(line);

      // Create arrowhead initially
      createArrowhead();

      // Add event listener for dragging
      line.addEventListener('mousedown', (e) => {
        this.singleArrowLine();
        this.selectedItemId = id;
        this.currentSVGElement = line;
        startDragging(e);
        updateHandles();
      });

      line.addEventListener('click', (e) => {
        e.stopPropagation();
      });

      if (!handleAdd) {
        createHandles();
        updateHandles();
        handleAdd = true;
      }
    };

    const createArrowhead = () => {

      const x1 = parseFloat(this.currentSVGElement?.getAttribute('x1')!);
      const y1 = parseFloat(this.currentSVGElement?.getAttribute('y1')!);
      const x2 = parseFloat(this.currentSVGElement?.getAttribute('x2')!);
      const y2 = parseFloat(this.currentSVGElement?.getAttribute('y2')!);

      const arrowheadLength = 20; // Length of arrowhead lines
      const arrowheadAngle = Math.PI / 6; // Angle of the arrowhead lines

      const angle = Math.atan2(y2 - y1, x2 - x1);
      const xOffset1 = arrowheadLength * Math.cos(angle - arrowheadAngle);
      const yOffset1 = arrowheadLength * Math.sin(angle - arrowheadAngle);
      const xOffset2 = arrowheadLength * Math.cos(angle + arrowheadAngle);
      const yOffset2 = arrowheadLength * Math.sin(angle + arrowheadAngle);

      // Create the arrowhead lines
      const arrowhead1 = document.createElementNS(SVG_NAMESPACE, 'line');
      arrowhead1.setAttribute('x1', x2.toString());
      arrowhead1.setAttribute('y1', y2.toString());
      arrowhead1.setAttribute('x2', (x2 - xOffset1).toString());
      arrowhead1.setAttribute('y2', (y2 - yOffset1).toString());
      arrowhead1.setAttribute('stroke', 'black');
      arrowhead1.setAttribute('strokeColor-width', '2');
      arrowhead1.setAttribute('class', `${this.selectedItemId}arrowhead`);

      const arrowhead2 = document.createElementNS(SVG_NAMESPACE, 'line');
      arrowhead2.setAttribute('x1', x2.toString());
      arrowhead2.setAttribute('y1', y2.toString());
      arrowhead2.setAttribute('x2', (x2 - xOffset2).toString());
      arrowhead2.setAttribute('y2', (y2 - yOffset2).toString());
      arrowhead2.setAttribute('stroke', 'black');
      arrowhead2.setAttribute('strokeColor-width', '2');
      arrowhead2.setAttribute('class', `${this.selectedItemId}arrowhead`);

      // Append arrowheads to the SVG canvas
      this.svgCanvas.appendChild(arrowhead1);
      this.svgCanvas.appendChild(arrowhead2);
    };

    const updateArrowhead = () => {
      const x1 = parseFloat(this.currentSVGElement?.getAttribute('x1')!);
      const y1 = parseFloat(this.currentSVGElement?.getAttribute('y1')!);
      const x2 = parseFloat(this.currentSVGElement?.getAttribute('x2')!);
      const y2 = parseFloat(this.currentSVGElement?.getAttribute('y2')!);

      // Calculate the angle of the line
      const angle = Math.atan2(y2 - y1, x2 - x1);

      // Arrowhead properties
      const arrowheadLength = 20; // Length of arrowhead lines
      const arrowheadAngle = Math.PI / 6; // Angle of the arrowhead lines

      // Calculate the offsets for the arrowhead lines
      const xOffset1 = arrowheadLength * Math.cos(angle - arrowheadAngle);
      const yOffset1 = arrowheadLength * Math.sin(angle - arrowheadAngle);
      const xOffset2 = arrowheadLength * Math.cos(angle + arrowheadAngle);
      const yOffset2 = arrowheadLength * Math.sin(angle + arrowheadAngle);

      // Get existing arrowheads from the map
      const arrowheads = this.svgCanvas.getElementsByClassName(`${this.selectedItemId}arrowhead`) as unknown as SVGElement[];


      if (arrowheads.length === 2) {
        // Update the positions of the arrowheads
        const [arrowhead1, arrowhead2] = arrowheads;

        // Update first arrowhead line
        arrowhead1.setAttribute('x1', x2.toString());
        arrowhead1.setAttribute('y1', y2.toString());
        arrowhead1.setAttribute('x2', (x2 - xOffset1).toString());
        arrowhead1.setAttribute('y2', (y2 - yOffset1).toString());

        // Update second arrowhead line
        arrowhead2.setAttribute('x1', x2.toString());
        arrowhead2.setAttribute('y1', y2.toString());
        arrowhead2.setAttribute('x2', (x2 - xOffset2).toString());
        arrowhead2.setAttribute('y2', (y2 - yOffset2).toString());
      }
    };

    const createHandles = () => {
      const handle1 = document.createElementNS(SVG_NAMESPACE, 'circle');
      const handle2 = document.createElementNS(SVG_NAMESPACE, 'circle');

      handle1.setAttribute('r', '5');
      handle2.setAttribute('r', '5');
      handle1.setAttribute('fill', 'white');
      handle2.setAttribute('fill', 'white');
      handle1.setAttribute('stroke', 'blue'); // Border color for the ellipse
      handle2.setAttribute('stroke', 'blue');
      handle1.setAttribute('strokeColor-width', '1');
      handle2.setAttribute('strokeColor-width', '1');
      handle1.setAttribute('class', 'line-handle');
      handle2.setAttribute('class', 'line-handle');

      handle1.style.cursor = 'pointer';
      handle2.style.cursor = 'pointer';

      // Set handle IDs for reference
      handle1.setAttribute('id', `line-handle1`);
      handle2.setAttribute('id', `line-handle2`);

      this.svgCanvas.appendChild(handle1);
      this.svgCanvas.appendChild(handle2);

      handle1.addEventListener('mousedown', (e) => startResizing(e, this.currentSVGElement!));
      handle2.addEventListener('mousedown', (e) => startResizing(e, this.currentSVGElement!));
      handle2.addEventListener('click', (e) => {
        e.stopPropagation();
      });

      handle1.addEventListener('click', (e) => {
        e.stopPropagation();
      });
      updateHandlePosition();
    };

    const startResizing = (e: MouseEvent, handle: SVGElement) => {
      isResizing = true;
      this.currentSVGElement = handle;
    };

    const updateHandles = () => {
      removeHandles();
      createHandles();
    };

    const updateHandlePosition = () => {
      const handle1 = document.getElementById(`line-handle1`) as unknown as SVGCircleElement;
      const handle2 = document.getElementById(`line-handle2`) as unknown as SVGCircleElement;
      handle1.setAttribute('cx', this.currentSVGElement?.getAttribute('x1')!);
      handle1.setAttribute('cy', this.currentSVGElement?.getAttribute('y1')!);
      handle2.setAttribute('cx', this.currentSVGElement?.getAttribute('x2')!);
      handle2.setAttribute('cy', this.currentSVGElement?.getAttribute('y2')!);

      // Update arrowheads to match the new position
      updateArrowhead();
    }

    const updateLine = (startX: number, startY: number, currentX: number, currentY: number) => {
      if (this.currentSVGElement) {
        this.currentSVGElement.setAttribute('x1', startX.toString());
        this.currentSVGElement.setAttribute('y1', startY.toString());
        this.currentSVGElement.setAttribute('x2', currentX.toString());
        this.currentSVGElement.setAttribute('y2', currentY.toString());
        updateHandlePosition();
      }
    };

    const getAdjustedCoordinates = (e: MouseEvent) => {
      const rect = this.svgCanvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const startDragging = (e: MouseEvent) => {
      if (this.currentSVGElement && !isResizing) {
        const adjusted = getAdjustedCoordinates(e);
        offsetX = adjusted.x - parseFloat(this.currentSVGElement.getAttribute('x1')!);
        offsetY = adjusted.y - parseFloat(this.currentSVGElement.getAttribute('y1')!);
        isDragging = true;
      }
    };

    const dragLine = (e: MouseEvent) => {
      if (isDragging && this.currentSVGElement) {

        const adjusted = getAdjustedCoordinates(e);
        const deltaX = adjusted.x - offsetX;
        const deltaY = adjusted.y - offsetY;
        const x1 = deltaX;
        const y1 = deltaY;
        const x2 = x1 + (parseFloat(this.currentSVGElement.getAttribute('x2')!) - parseFloat(this.currentSVGElement.getAttribute('x1')!));
        const y2 = y1 + (parseFloat(this.currentSVGElement.getAttribute('y2')!) - parseFloat(this.currentSVGElement.getAttribute('y1')!));

        this.currentSVGElement.setAttribute('x1', x1.toString());
        this.currentSVGElement.setAttribute('y1', y1.toString());
        this.currentSVGElement.setAttribute('x2', x2.toString());
        this.currentSVGElement.setAttribute('y2', y2.toString());

        // Update arrowheads and handles after dragging
        updateHandlePosition();
      }
    };

    const resizeLine = (e: MouseEvent) => {
      if (isResizing && this.currentSVGElement && activeHandle) {
        const adjusted = getAdjustedCoordinates(e);

        if (activeHandle.id.includes('handle1')) {
          this.currentSVGElement.setAttribute('x1', adjusted.x.toString());
          this.currentSVGElement.setAttribute('y1', adjusted.y.toString());
        } else {
          this.currentSVGElement.setAttribute('x2', adjusted.x.toString());
          this.currentSVGElement.setAttribute('y2', adjusted.y.toString());
        }

        // Update arrowheads and handles after resizing
        updateHandlePosition();
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.target instanceof SVGCircleElement) {
        isResizing = true;
        isDragging = false;
        activeHandle = e.target as SVGCircleElement;
      }
      if (e.target instanceof SVGLineElement) {
        startDragging(e);
      } else {
        if (this.shapeType !== 'cursor') {
          if (!this.currentSVGElement) {
            const rect = this.svgCanvas.getBoundingClientRect();
            startX = e.clientX - rect.left;
            startY = e.clientY - rect.top;

            createLine();
            isDrawing = true;
          }
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        dragLine(e);
      } else if (isResizing) {
        resizeLine(e);
      } else if (isDrawing && this.currentSVGElement) {
        const adjusted = getAdjustedCoordinates(e);
        updateLine(startX, startY, adjusted.x, adjusted.y);
      }
    };

    const handleMouseUp = () => {
      if (isDrawing) {
        timer(500).subscribe({
          next: () => {
            this.isDrawing = false;
          }
        });
        isDrawing = false;
      }
      if (isDragging) {
        isDragging = false;
        updateHandlePosition();
      }
      if (isResizing) {
        isResizing = false;
        activeHandle = null;
      }
      this.shapeType = 'cursor';
      this.svgCanvas.style.cursor = 'default';
    };

    this.addListeners = () => {
      this.svgCanvas.addEventListener('mousedown', handleMouseDown);
      this.svgCanvas.addEventListener('mousemove', handleMouseMove);
      this.svgCanvas.addEventListener('mouseup', handleMouseUp);
    };

    this.removeListeners = () => {
      this.svgCanvas.removeEventListener('mousedown', handleMouseDown);
      this.svgCanvas.removeEventListener('mousemove', handleMouseMove);
      this.svgCanvas.removeEventListener('mouseup', handleMouseUp);
    };

    this.addListeners();
  }

  doubleArrowLine() {
    if (this.removeListeners) {
      this.removeListeners();
    }

    this.currentSVGElement = null;
    this.svgCanvas.style.cursor = 'crosshair';
    const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
    let isDrawing = false;
    let isDragging = false;
    let isResizing = false;
    let activeHandle: SVGCircleElement | null = null;
    let offsetX: number;
    let offsetY: number;
    let startX: number;
    let startY: number;
    let handleAdd = false;

    const arrowheadLength = 20; // Length of arrowhead lines
    const arrowheadAngle = Math.PI / 6; // Angle of the arrowhead lines

    const removeHandles = () => {
      this.currentRectangle?.setAttribute('stroke', 'transparent');
      const polyHandles = document.querySelectorAll('.resize-handle');
      polyHandles.forEach(handle => handle.remove());
      const oldHandles = document.querySelectorAll('.line-handle');
      oldHandles.forEach(handle => handle.remove());
    }

    const createLine = () => {
      let id = this.IdGen();
      let line = document.createElementNS(SVG_NAMESPACE, 'line');
      line.setAttribute('stroke', 'black'); // Line color
      line.setAttribute('strokeColor-width', '2');// Rounded joins to smoothen the curve
      // line.setAttribute('strokeColor-dasharray', '5,5');
      line.setAttribute('id', `${id}line`);
      line.style.pointerEvents = 'all'; // Allow pointer events for dragging
      line.style.cursor = 'move';
      this.currentSVGElement = line;
      this.currentSVGElement.setAttribute('x1', startX.toString());
      this.currentSVGElement.setAttribute('y1', startY.toString());
      this.currentSVGElement.setAttribute('x2', startX.toString());
      this.currentSVGElement.setAttribute('y2', startY.toString());
      this.selectedItemId = id;
      this.isDrawing = true;
      this.svgCanvas.appendChild(line);

      // Create arrowhead initially
      createArrowhead();

      // Add event listener for dragging
      line.addEventListener('mousedown', (e) => {
        this.doubleArrowLine();
        this.selectedItemId = id;
        this.currentSVGElement = line;
        startDragging(e);
        updateHandles();
      });

      line.addEventListener('click', (e) => {
        e.stopPropagation();
      });

      if (!handleAdd) {
        createHandles();
        updateHandles();
        handleAdd = true;
      }
    };

    const createArrowhead = () => {
      const line = this.currentSVGElement as SVGLineElement;
      if (!line) return;

      const x1 = parseFloat(line.getAttribute('x1')!);
      const y1 = parseFloat(line.getAttribute('y1')!);
      const x2 = parseFloat(line.getAttribute('x2')!);
      const y2 = parseFloat(line.getAttribute('y2')!);

      // Angle of the line from (x1, y1) to (x2, y2)
      const angle1 = Math.atan2(y2 - y1, x2 - x1);

      // Angle of the line from (x2, y2) to (x1, y1)
      const angle2 = Math.atan2(y1 - y2, x1 - x2);

      // Offset calculations for the arrowheads
      const xOffset1 = arrowheadLength * Math.cos(angle1 - arrowheadAngle);
      const yOffset1 = arrowheadLength * Math.sin(angle1 - arrowheadAngle);
      const xOffset2 = arrowheadLength * Math.cos(angle1 + arrowheadAngle);
      const yOffset2 = arrowheadLength * Math.sin(angle1 + arrowheadAngle);

      // Create arrowheads at the start
      const arrowhead1 = document.createElementNS(SVG_NAMESPACE, 'line');
      arrowhead1.setAttribute('x1', x1.toString());
      arrowhead1.setAttribute('y1', y1.toString());
      arrowhead1.setAttribute('x2', (x1 + xOffset1).toString());
      arrowhead1.setAttribute('y2', (y1 + yOffset1).toString());
      arrowhead1.setAttribute('stroke', 'black');
      arrowhead1.setAttribute('strokeColor-width', '2');
      arrowhead1.setAttribute('class', `${this.selectedItemId}arrowhead`);

      const arrowhead2 = document.createElementNS(SVG_NAMESPACE, 'line');
      arrowhead2.setAttribute('x1', x1.toString());
      arrowhead2.setAttribute('y1', y1.toString());
      arrowhead2.setAttribute('x2', (x1 + xOffset2).toString());
      arrowhead2.setAttribute('y2', (y1 + yOffset2).toString());
      arrowhead2.setAttribute('stroke', 'black');
      arrowhead2.setAttribute('strokeColor-width', '2');
      arrowhead2.setAttribute('class', `${this.selectedItemId}arrowhead`);

      // Create arrowheads at the end
      const arrowhead3 = document.createElementNS(SVG_NAMESPACE, 'line');
      arrowhead3.setAttribute('x1', x2.toString());
      arrowhead3.setAttribute('y1', y2.toString());
      arrowhead3.setAttribute('x2', (x2 - xOffset1).toString());
      arrowhead3.setAttribute('y2', (y2 - yOffset1).toString());
      arrowhead3.setAttribute('stroke', 'black');
      arrowhead3.setAttribute('strokeColor-width', '2');
      arrowhead3.setAttribute('class', `${this.selectedItemId}arrowhead`);

      const arrowhead4 = document.createElementNS(SVG_NAMESPACE, 'line');
      arrowhead4.setAttribute('x1', x2.toString());
      arrowhead4.setAttribute('y1', y2.toString());
      arrowhead4.setAttribute('x2', (x2 - xOffset2).toString());
      arrowhead4.setAttribute('y2', (y2 - yOffset2).toString());
      arrowhead4.setAttribute('stroke', 'black');
      arrowhead4.setAttribute('strokeColor-width', '2');
      arrowhead4.setAttribute('class', `${this.selectedItemId}arrowhead`);

      // Append arrowheads to the SVG canvas
      this.svgCanvas.appendChild(arrowhead1);
      this.svgCanvas.appendChild(arrowhead2);
      this.svgCanvas.appendChild(arrowhead3);
      this.svgCanvas.appendChild(arrowhead4);
    };

    const updateArrowhead = () => {
      const line = this.currentSVGElement as SVGLineElement;
      if (!line) return;

      const x1 = parseFloat(line.getAttribute('x1')!);
      const y1 = parseFloat(line.getAttribute('y1')!);
      const x2 = parseFloat(line.getAttribute('x2')!);
      const y2 = parseFloat(line.getAttribute('y2')!);

      // Angle of the line from (x1, y1) to (x2, y2)
      const angle1 = Math.atan2(y2 - y1, x2 - x1);

      // Angle of the line from (x2, y2) to (x1, y1)
      const angle2 = Math.atan2(y1 - y2, x1 - x2);

      // Offset calculations for the arrowheads
      const xOffset1 = arrowheadLength * Math.cos(angle1 - arrowheadAngle);
      const yOffset1 = arrowheadLength * Math.sin(angle1 - arrowheadAngle);
      const xOffset2 = arrowheadLength * Math.cos(angle1 + arrowheadAngle);
      const yOffset2 = arrowheadLength * Math.sin(angle1 + arrowheadAngle);

      const arrowheads = this.svgCanvas.getElementsByClassName(`${this.selectedItemId}arrowhead`) as unknown as SVGLineElement[];

      if (arrowheads.length === 4) {
        // Update the positions of the arrowheads
        const [arrowhead1, arrowhead2, arrowhead3, arrowhead4] = arrowheads;

        // Update arrowheads at the start of the line
        arrowhead1.setAttribute('x1', x1.toString());
        arrowhead1.setAttribute('y1', y1.toString());
        arrowhead1.setAttribute('x2', (x1 + xOffset1).toString());
        arrowhead1.setAttribute('y2', (y1 + yOffset1).toString());

        arrowhead2.setAttribute('x1', x1.toString());
        arrowhead2.setAttribute('y1', y1.toString());
        arrowhead2.setAttribute('x2', (x1 + xOffset2).toString());
        arrowhead2.setAttribute('y2', (y1 + yOffset2).toString());

        // Update arrowheads at the end of the line
        arrowhead3.setAttribute('x1', x2.toString());
        arrowhead3.setAttribute('y1', y2.toString());
        arrowhead3.setAttribute('x2', (x2 - xOffset1).toString());
        arrowhead3.setAttribute('y2', (y2 - yOffset1).toString());

        arrowhead4.setAttribute('x1', x2.toString());
        arrowhead4.setAttribute('y1', y2.toString());
        arrowhead4.setAttribute('x2', (x2 - xOffset2).toString());
        arrowhead4.setAttribute('y2', (y2 - yOffset2).toString());
      }
    };

    const createHandles = () => {
      const handle1 = document.createElementNS(SVG_NAMESPACE, 'circle');
      const handle2 = document.createElementNS(SVG_NAMESPACE, 'circle');

      handle1.setAttribute('r', '5');
      handle2.setAttribute('r', '5');
      handle1.setAttribute('fill', 'white');
      handle2.setAttribute('fill', 'white');
      handle1.setAttribute('stroke', 'blue'); // Border color for the ellipse
      handle2.setAttribute('stroke', 'blue');
      handle1.setAttribute('strokeColor-width', '1');
      handle2.setAttribute('strokeColor-width', '1');
      handle1.setAttribute('class', 'line-handle');
      handle2.setAttribute('class', 'line-handle');

      handle1.style.cursor = 'pointer';
      handle2.style.cursor = 'pointer';

      // Set handle IDs for reference
      handle1.setAttribute('id', `line-handle1`);
      handle2.setAttribute('id', `line-handle2`);

      this.svgCanvas.appendChild(handle1);
      this.svgCanvas.appendChild(handle2);

      handle1.addEventListener('mousedown', (e) => startResizing(e, this.currentSVGElement!));
      handle2.addEventListener('mousedown', (e) => startResizing(e, this.currentSVGElement!));
      handle2.addEventListener('click', (e) => {
        e.stopPropagation();
      });

      handle1.addEventListener('click', (e) => {
        e.stopPropagation();
      });

      updateHandlePosition();
    };

    const startResizing = (e: MouseEvent, handle: SVGElement) => {
      isResizing = true;
      this.currentSVGElement = handle;
    };

    const updateHandles = () => {
      removeHandles();
      createHandles();
    };

    const updateHandlePosition = () => {
      const handle1 = document.getElementById(`line-handle1`) as unknown as SVGCircleElement;
      const handle2 = document.getElementById(`line-handle2`) as unknown as SVGCircleElement;
      handle1.setAttribute('cx', this.currentSVGElement?.getAttribute('x1')!);
      handle1.setAttribute('cy', this.currentSVGElement?.getAttribute('y1')!);
      handle2.setAttribute('cx', this.currentSVGElement?.getAttribute('x2')!);
      handle2.setAttribute('cy', this.currentSVGElement?.getAttribute('y2')!);

      // Update arrowheads to match the new position
      updateArrowhead();
    }

    const updateLine = (startX: number, startY: number, currentX: number, currentY: number) => {
      if (this.currentSVGElement) {
        this.currentSVGElement.setAttribute('x1', startX.toString());
        this.currentSVGElement.setAttribute('y1', startY.toString());
        this.currentSVGElement.setAttribute('x2', currentX.toString());
        this.currentSVGElement.setAttribute('y2', currentY.toString());
        updateHandlePosition();
      }
    };

    const getAdjustedCoordinates = (e: MouseEvent) => {
      const rect = this.svgCanvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const startDragging = (e: MouseEvent) => {
      if (this.currentSVGElement && !isResizing) {
        const adjusted = getAdjustedCoordinates(e);
        offsetX = adjusted.x - parseFloat(this.currentSVGElement.getAttribute('x1')!);
        offsetY = adjusted.y - parseFloat(this.currentSVGElement.getAttribute('y1')!);
        isDragging = true;
      }
    };

    const dragLine = (e: MouseEvent) => {
      if (isDragging && this.currentSVGElement) {

        const adjusted = getAdjustedCoordinates(e);
        const deltaX = adjusted.x - offsetX;
        const deltaY = adjusted.y - offsetY;
        const x1 = deltaX;
        const y1 = deltaY;
        const x2 = x1 + (parseFloat(this.currentSVGElement.getAttribute('x2')!) - parseFloat(this.currentSVGElement.getAttribute('x1')!));
        const y2 = y1 + (parseFloat(this.currentSVGElement.getAttribute('y2')!) - parseFloat(this.currentSVGElement.getAttribute('y1')!));

        this.currentSVGElement.setAttribute('x1', x1.toString());
        this.currentSVGElement.setAttribute('y1', y1.toString());
        this.currentSVGElement.setAttribute('x2', x2.toString());
        this.currentSVGElement.setAttribute('y2', y2.toString());

        // Update arrowheads and handles after dragging
        updateHandlePosition();
      }
    };

    const resizeLine = (e: MouseEvent) => {
      if (isResizing && this.currentSVGElement && activeHandle) {
        const adjusted = getAdjustedCoordinates(e);

        if (activeHandle.id.includes('handle1')) {
          this.currentSVGElement.setAttribute('x1', adjusted.x.toString());
          this.currentSVGElement.setAttribute('y1', adjusted.y.toString());
        } else {
          this.currentSVGElement.setAttribute('x2', adjusted.x.toString());
          this.currentSVGElement.setAttribute('y2', adjusted.y.toString());
        }

        // Update arrowheads and handles after resizing
        updateHandlePosition();
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.target instanceof SVGCircleElement) {
        isResizing = true;
        isDragging = false;
        activeHandle = e.target as SVGCircleElement;
      }
      if (e.target instanceof SVGLineElement) {
        startDragging(e);
      } else {
        if (this.shapeType !== 'cursor') {
          if (!this.currentSVGElement) {
            const rect = this.svgCanvas.getBoundingClientRect();
            startX = e.clientX - rect.left;
            startY = e.clientY - rect.top;

            createLine();
            isDrawing = true;
          }
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        dragLine(e);
      } else if (isResizing) {
        resizeLine(e);
      } else if (isDrawing && this.currentSVGElement) {
        const adjusted = getAdjustedCoordinates(e);
        updateLine(startX, startY, adjusted.x, adjusted.y);
      }
    };

    const handleMouseUp = () => {
      if (isDrawing) {
        timer(500).subscribe({
          next: () => {
            this.isDrawing = false;
          }
        });
        isDrawing = false;
      }
      if (isDragging) {
        isDragging = false;
        updateHandlePosition();
      }
      if (isResizing) {
        isResizing = false;
        activeHandle = null;
      }
      this.shapeType = 'cursor';
      this.svgCanvas.style.cursor = 'default';
    };

    this.addListeners = () => {
      this.svgCanvas.addEventListener('mousedown', handleMouseDown);
      this.svgCanvas.addEventListener('mousemove', handleMouseMove);
      this.svgCanvas.addEventListener('mouseup', handleMouseUp);
    };

    this.removeListeners = () => {
      this.svgCanvas.removeEventListener('mousedown', handleMouseDown);
      this.svgCanvas.removeEventListener('mousemove', handleMouseMove);
      this.svgCanvas.removeEventListener('mouseup', handleMouseUp);
    };

    this.addListeners();
  }

  createRectangle () {
    this.shapeType = 'rectangle';
    this.rectangle();
  }

  createTriangle () {
    this.shapeType = 'polygon';
    this.polygon();
  }

  createCircle() {
    this.shapeType = 'ellipse';
    this.ellipse();
  }

  createLine() {
    this.shapeType = 'line';
    this.line();
  }

  createText() {
    this.shapeType = 'text box';
    this.textbox();
  }

  createSingleArrowLine() {
    this.shapeType = 'single arrow';
    this.singleArrowLine();
  }

  createDoubleArrowLine() {
    this.shapeType = 'double arrow';
    this.doubleArrowLine();
  }

  updateSVGStrokeColor(color: string) {
    if (this.currentSVGElement) {
      this.currentSVGElement.setAttribute('stroke', color);
    }
  }

  updateSVGFillColor(color: string) {
    if (this.currentSVGElement) {
      console.log(namer(color).pantone[0]);
      this.currentSVGElement.setAttribute('fill', color);
    }
  }

  updateSVGStrokeColor2(color: string) {
    if (this.currentSVGElement) {
      this.currentSVGElement.setAttribute('stroke', color);
    }
  }

  updateSVGSides() {
    if (this.currentSVGElement) {
      this.updatePolygon();
    }
  }

  updateSVGStrokeWidth(width: number) {
    if (this.currentSVGElement) {
      this.currentSVGElement.setAttribute('stroke-width', width.toString());
      if (this.itemSelected.type === "polygon") {
        this.updatePolygon();
      }
    }
  }

  updatePolygon = () => {
    if (this.currentRectangle && this.currentSVGElement) {
      const rectX = parseFloat(this.currentRectangle.getAttribute('x')!);
      const rectY = parseFloat(this.currentRectangle.getAttribute('y')!);
      const width = parseFloat(this.currentRectangle.getAttribute('width')!);
      const height = parseFloat(this.currentRectangle.getAttribute('height')!);

      const padding = 8 + this.itemSelected.strokeWidth; // Define padding to ensure tips do not get cut off

      const innerWidth = width - 4 * padding;
      const innerHeight = height - 4 * padding;
      const centerX = rectX + width / 2;
      const centerY = rectY + height / 2;

      const points: [number, number][] = [];

      if (this.itemSelected.numberOfPoints === 3) {
        // Triangle
        const pointA: [number, number] = [centerX - innerWidth / 2, centerY + innerHeight / 2];
        const pointB: [number, number] = [centerX + innerWidth / 2, centerY + innerHeight / 2];
        const pointC: [number, number] = [centerX, centerY - innerHeight / 2 + padding];
        points.push(pointA, pointB, pointC);
      } else {
        // Regular polygon
        const radiusX = innerWidth / 2;
        const radiusY = innerHeight / 2;
        const angleStep = (2 * Math.PI) / this.itemSelected.numberOfPoints;

        for (let i = 0; i < this.itemSelected.numberOfPoints; i++) {
          const angle = i * angleStep - Math.PI / 2; // Start from the top
          const x = centerX + radiusX * Math.cos(angle);
          const y = centerY + radiusY * Math.sin(angle);
          points.push([x, y]);
        }
      }

      this.itemSelected.points = points;
      const pointsAttr = points.map(point => point.join(',')).join(' ');
      if (pointsAttr) {
        this.currentSVGElement?.setAttribute('points', pointsAttr);
      }
    }
  }

  generateRandom2() {
    this.mainTwo = [chroma.random().hex()];
    this.strokeColors = chroma.scale(this.mainTwo).colors(12);
  }

  colorName(color: any) {
    return chroma(color).name();
  }
}
