import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as fabric from 'fabric';

@Component({
  selector: 'app-fabricjs-page',
  templateUrl: './fabricjs-page.component.html',
  styleUrl: './fabricjs-page.component.css'
})
export class FabricjsPageComponent implements OnInit, AfterViewInit {
  @ViewChild('canvasContainer', { static: true }) canvasContainer!: ElementRef<HTMLDivElement>;

  private canvas!: fabric.Canvas;
  zoomLevel: number = 1;
  size: {width: number, height: number} = {width: 0, height: 0};

  get zoomPercentage(): number {
    return Math.round(this.zoomLevel * 100);
  }

  private initializeCanvas(): void {
    this.size = this.calculateCanvasSize('horizontal', true);
    this.canvas = new fabric.Canvas( document.getElementById('canvas') as HTMLCanvasElement, {
      width: this.size.width,
      height: this.size.height,
      backgroundColor: '#fff',
      selection: false // Disable selection to avoid unwanted selection of objects
    });

    this.enablePanning();
  }

  addRectangle(): void {
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      fill: 'transparent',
      strokeWidth: 1,
      stroke: 'blue',
      strokeUniform: true,
      width: 50,
      height: 50
    });
    this.canvas.add(rect);
  }

  ngOnInit(): void {
    this.initializeCanvas();
  }

  // Zoom In
  zoomIn(): void {
    this.zoomLevel += 0.1;
    // this.canvas.setZoom(this.zoomLevel);
    this.applyZoom()
  }

  // Zoom Out
  zoomOut(): void {
    this.zoomLevel -= 0.1;
    this.applyZoom()
    // this.canvas.setZoom(this.zoomLevel);
  }

  applyZoom() {
    this.canvasContainer.nativeElement.style.transform = `scale(${this.zoomLevel})`;
  }

  enablePanning(): void {
    let isPanning = false;
    let lastPosX = 0;
    let lastPosY = 0;

    this.canvas.on('mouse:down', (opt) => {
      const evt = opt.e as MouseEvent;
      if (evt.altKey || evt.button === 1) { // ALT key or middle mouse button
        isPanning = true;
        lastPosX = evt.clientX;
        lastPosY = evt.clientY;
        this.canvas.setCursor('grab');
      }
    });

    this.canvas.on('mouse:move', (opt) => {
      if (isPanning && opt.e) {
        const e = opt.e as MouseEvent;
        const vpt = this.canvas.viewportTransform!;
        vpt[4] += e.clientX - lastPosX;
        vpt[5] += e.clientY - lastPosY;
        this.canvas.requestRenderAll();
        lastPosX = e.clientX;
        lastPosY = e.clientY;
      }
    });

    this.canvas.on('mouse:up', () => {
      isPanning = false;
      this.canvas.setCursor('default');
    });
  }

  addText(): void {
    const text = new fabric.Textbox('Enter text here', {
      left: 150,
      top: 150,
      fontSize: 24,
      fill: 'black',     // text color
      editable: true,    // allow editing if needed
      fontFamily: 'Arial',
      stroke: 'transparent',  // no text stroke unless you want
      strokeWidth: 2,
      strokeUniform: true,
      lockScalingY: true,

    });

    this.canvas.add(text);
  }

  calculateCanvasSize(orientation: 'horizontal' | 'vertical', frontAndBack: boolean): { width: number, height: number } {
    // Default dimensions for horizontal orientation (1012 x 637)
    let width = 1012;
    let height = 637;

    // Adjust for vertical orientation (637 x 1012)
    if (orientation === 'vertical') {
      width = 637;
      height = 1012;
    }

    // If it's front and back, double the height
    if (frontAndBack) {
      height *= 2;
    }

    return { width, height };
  }

  ngAfterViewInit(): void {

  }
}
