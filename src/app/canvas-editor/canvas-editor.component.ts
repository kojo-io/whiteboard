import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-canvas-editor',
  templateUrl: './canvas-editor.component.html',
  styleUrl: './canvas-editor.component.css'
})
export class CanvasEditorComponent implements OnInit {

  shapeType: 'polygon' | 'rectangle' | 'ellipse' | 'line' | 'single arrow' | 'double arrow' | 'text box' | 'cursor'  = "cursor";

  ngOnInit(): void {
  }

  rectangle() {
    let canvas = document.getElementById('canvas') as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let shapes: { x: number; y: number; width: number; height: number; fillColor: string; strokeColor: string }[] = [];
    let currentShape: { x: number; y: number; width: number; height: number; fillColor: string; strokeColor: string } | null = null;
    let isDrawing = false;
    let isResizing = false;
    let isDragging = false;
    let startX = 0;
    let startY = 0;

    function onMouseDown(e: MouseEvent) {
      const mousePos = getMousePosition(e);
      const shape = getShapeAtPosition(mousePos);

      if (shape) {
        currentShape = shape;
        startX = mousePos.x;
        startY = mousePos.y;

        if (isOverHandle(mousePos, shape)) {
          isResizing = true;
        } else {
          isDragging = true;
        }
      } else {
        isDrawing = true;
        currentShape = createShape(mousePos.x, mousePos.y);
        shapes.push(currentShape);
      }
    }

    function onMouseMove(e: MouseEvent) {
      if (!currentShape) return;

      const mousePos = getMousePosition(e);

      if (isDrawing) {
        updateShape(currentShape, mousePos.x, mousePos.y);
      } else if (isResizing) {
        resizeShape(currentShape, mousePos.x, mousePos.y);
      } else if (isDragging) {
        dragShape(currentShape, mousePos.x - startX, mousePos.y - startY);
        startX = mousePos.x;
        startY = mousePos.y;
      }

      drawCanvas(); // Re-draw the canvas on every mouse move
    }

    function onMouseUp() {
      isDrawing = false;
      isResizing = false;
      isDragging = false;
      currentShape = null;
    }

    function createShape(x: number, y: number) {
      return {
        x: x,
        y: y,
        width: 0,
        height: 0,
        fillColor: 'rgba(100, 150, 200, 0.5)', // Example fill color with transparency
        strokeColor: 'black' // Example stroke color
      };
    }

    function updateShape(shape: { x: number; y: number; width: number; height: number; fillColor: string; strokeColor: string }, x: number, y: number) {
      shape.width = x - shape.x;
      shape.height = y - shape.y;
    }

    function resizeShape(shape: { x: number; y: number; width: number; height: number; fillColor: string; strokeColor: string }, x: number, y: number) {
      shape.width = x - shape.x;
      shape.height = y - shape.y;
    }

    function dragShape(shape: { x: number; y: number; width: number; height: number; fillColor: string; strokeColor: string }, dx: number, dy: number) {
      shape.x += dx;
      shape.y += dy;
    }

    function getShapeAtPosition(pos: { x: number; y: number }) {
      return shapes.find(shape => pos.x > shape.x && pos.x < shape.x + shape.width &&
        pos.y > shape.y && pos.y < shape.y + shape.height) || null;
    }

    function isOverHandle(pos: { x: number; y: number }, shape: { x: number; y: number; width: number; height: number }) {
      const handleSize = 10;
      return pos.x > shape.x + shape.width - handleSize &&
        pos.x < shape.x + shape.width + handleSize &&
        pos.y > shape.y + shape.height - handleSize &&
        pos.y < shape.y + shape.height + handleSize;
    }

    function getMousePosition(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }

    function drawCanvas() {
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      shapes.forEach(shape => drawShape(shape));
    }

    function drawShape(shape: { x: number; y: number; width: number; height: number; fillColor: string; strokeColor: string }) {
      if (ctx) {
        ctx.beginPath();
        ctx.rect(shape.x, shape.y, shape.width, shape.height);
        ctx.fillStyle = shape.fillColor;
        ctx.fill();
        ctx.strokeStyle = shape.strokeColor;
        ctx.stroke();
      }
    }

    // Attach event listeners to the canvas
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
  }

}
