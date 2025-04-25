import {Component, inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ElementInfo} from "../../models/element-info";
import {timer} from "rxjs";
import * as QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';
import {coloris, init} from "@melloware/coloris";
import Cropper from 'cropperjs';
import {ModalRef} from "../../components/modal/modal-ref";
import {ModalService} from "../../components/modal/modal.service";
import {Template} from "../../models/template";

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css'
})
export class EditorComponent implements OnInit{
  elements: ElementInfo[] = [];
  templateInfo: Template = {
    grid: 50,
    gridColor: '#ccc',
    backgroundImage: "",
    created: new Date,
    description: "",
    id: "",
    name: "",
    orientation: 0,
    showGrid: false,
  };
  isDrawing = false;
  isUpdate = false;
  itemSelected!: ElementInfo;
  selectedItemId: any;
  showBackground = false;
  currentRectangle: SVGRectElement | null = null;
  currentSVGElement: SVGElement | null = null;
  currentHTMLElement: HTMLElement | null = null;
  imageElement : HTMLImageElement | null = null;
  SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

  shapeType: 'text box' | 'image' | 'barcode' | 'qrcode' | 'cursor' | 'polygon'  = "cursor";
  removeListeners!: (() => void)
  addListeners!: (() => void)

  body!: HTMLDivElement;
  toolBox!: HTMLDivElement;
  svgCanvas!: SVGSVGElement;
  cropper!: Cropper;
  cropModal!: ModalRef;
  modalService = inject(ModalService);

  @ViewChild('cropper', { static: false }) cropperModal!: TemplateRef<any>;

  ngOnInit(): void {
    init();
    coloris({
      el: '.bg-coloris',
      theme: 'polaroid',
      themeMode: 'dark',
      formatToggle: true,
      closeButton: true,
      clearButton: true,
      swatches: [
        '#067bc2',
        '#84bcda',
        '#80e377',
        '#ecc30b',
        '#f37748',
        '#d56062'
      ]
    });
    this.body = document.querySelector('#body-drag') as HTMLDivElement;
    this.toolBox = document.querySelector('#toolbox') as HTMLDivElement;
    this.svgCanvas = document.querySelector('#canvas') as SVGSVGElement;
    this.toolBox.addEventListener('click', (e) => {
      // e.stopPropagation();
    })

    this.svgCanvas.addEventListener('click', (e) => {
      this.showBackground = true;
      if (this.isDrawing) {
        return;
      }
      this.checkAndRemoveElements();
      if (this.removeListeners) {
        this.removeListeners();
      }
      this.removeHandles();
    })
  }

  checkAndRemoveElements = () => {
    if (this.currentHTMLElement instanceof HTMLHeadingElement && this.currentRectangle) {
      const content = this.currentHTMLElement.textContent?.trim();

      // If the h1 element is empty
      if (!content) {
        // Hide or remove elements
        this.currentHTMLElement.style.display = 'none'; // Hide the <h1> element
        this.currentRectangle.style.display = 'none'; // Hide the rectangle
        this.elements.splice(this.elements.findIndex(u => u.id === this.itemSelected.id), 1)
        // Optionally, remove elements from DOM if needed
        this.body.removeChild(this.currentHTMLElement)
        this.svgCanvas.removeChild(this.currentRectangle);
        this.currentSVGElement = null;
        this.currentHTMLElement = null;
        this.currentRectangle = null;
      } else {
        // Ensure the elements are visible if they contain content
        this.currentHTMLElement.style.display = '';
        this.currentRectangle.style.display = '';
      }
    }
  };

  removeHtmlElement() {
    if (this.currentHTMLElement && this.currentRectangle) {
      this.elements.splice(this.elements.findIndex(u => u.id === this.itemSelected.id), 1);
      this.body.removeChild(this.currentHTMLElement!)
      this.svgCanvas.removeChild(this.currentRectangle!);
      if (this.removeListeners) {
        this.removeListeners();
      }
      this.removeHandles();
      this.currentHTMLElement = null;
      this.currentRectangle = null;
      this.shapeType = 'cursor';
      this.svgCanvas.style.cursor = 'default';
    }
  }

  removeSVGElement() {
    if (this.currentSVGElement && this.currentRectangle) {
      this.elements.splice(this.elements.findIndex(u => u.id === this.itemSelected.id), 1);
      this.svgCanvas.removeChild(this.currentSVGElement!)
      this.svgCanvas.removeChild(this.currentRectangle!);
      if (this.removeListeners) {
        this.removeListeners();
      }
      this.removeHandles();
      this.currentSVGElement = null;
      this.currentRectangle = null;
      this.shapeType = 'cursor';
      this.svgCanvas.style.cursor = 'default';
    }
  }

  removeHandles = () => {
    this.currentRectangle?.setAttribute('stroke', 'transparent');
    const polyHandles = document.querySelectorAll('.resize-handle');
    polyHandles.forEach(handle => handle.remove());
    const oldHandles = document.querySelectorAll('.line-handle');
    oldHandles.forEach(handle => handle.remove());
  }

  IdGen() {
    return 'xxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  textbox() {
    if (this.removeListeners) {
      this.removeListeners();
    }

    this.showBackground = false;
    this.currentHTMLElement = null;
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
        this.currentHTMLElement = textInput;
        this.itemSelected = this.elements.find(element => element.id === id) as ElementInfo;
        this.updateTextPosition();
        updateHandles(); // Update handles when rectangle is clicked
      });

      rect?.addEventListener('click', (e) => {
        e.stopPropagation();
      })

      rect.addEventListener('dblclick', () => {
        this.currentHTMLElement?.focus();
        setCursorToEnd(this.currentHTMLElement!)
      });

      if (!handleAdd) {
        addResizeHandles();
        handleAdd = true;
      }
    };

    const createTextInput = (id: any): HTMLElement | null => {
      if (this.currentRectangle) {
        this.itemSelected = {
          backgroundColor: "transparent",
          id: id,
          positionX: startX,
          positionY: startY,
          type: 'text box',
          fontWeight: 400,
          fontStyle: "normal",
          textDecorationLine: "none",
          textDecorationStyle: "solid",
          textDecorationThickness: 5,
          textAlign: 'left',
          borderStyle: "none",
          borderWidth: 1,
          fontSize: 30
        };

        this.elements.push(this.itemSelected);

        let textInput = document.createElement('h1');
        textInput.style.position = 'absolute';
        textInput.style.background = `${this.itemSelected.backgroundColor}`;
        textInput.style.fontWeight = `${this.itemSelected.fontWeight}`;
        textInput.style.fontStyle =  `${this.itemSelected.fontStyle}`;
        textInput.style.textDecorationLine = `${this.itemSelected.textDecorationLine}`;
        textInput.style.textDecorationStyle = `${this.itemSelected.textDecorationStyle}`;
        textInput.style.textDecorationThickness = `${this.itemSelected.textDecorationThickness}`;
        textInput.style.borderStyle = `${this.itemSelected.borderStyle}`;
        textInput.style.borderWidth = `${this.itemSelected.borderWidth}`;
        textInput.style.outline = 'none';
        textInput.style.fontSize = `${this.itemSelected.fontSize}px`;
        textInput.style.pointerEvents = 'none';
        textInput.style.paddingLeft = '10px';
        textInput.style.paddingRight = '10px';
        textInput.style.paddingTop = '5px';
        textInput.style.paddingBottom = '5px';
        textInput.style.lineHeight = '1.1';
        textInput.contentEditable = 'true';
        textInput.id = `${id}textInput`;

        this.currentHTMLElement = textInput;

        textInput.addEventListener('focus', () => {
          isResizing = false;
          isDrawing = false;// Disable resizing when input is focused
        });
        textInput.addEventListener('blur', () => {
          isResizing = true; // Enable resizing when input is blurred
        });
        textInput.addEventListener('input', () => {
          const inputHeight = parseFloat(`${this.currentHTMLElement?.scrollHeight}`);
          this.currentRectangle?.setAttribute('height', inputHeight.toString());
          this.itemSelected.value = `${this.currentHTMLElement?.textContent}`;
          updateHandles();
        });

        this.svgCanvas.parentElement?.appendChild(textInput);
        this.updateTextPosition();
        return textInput;
      }

      return null;
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
            handle.setAttribute('x', Math.abs(rectX - 5).toString());
            handle.setAttribute('y', Math.abs(rectY + rectHeight / 2 - 5).toString());
            break;
          case 'right':
            handle.setAttribute('x', Math.abs(rectX + rectWidth - 5).toString());
            handle.setAttribute('y', Math.abs(rectY + rectHeight / 2 - 5).toString());
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
        // Fixed height during draw

        // Update input size to match the rectangle
        if (this.currentHTMLElement) {
          this.currentHTMLElement.style.width = '${Math.abs(width)}px';
          // Update font size based on fixed height
          if (this.currentHTMLElement.textContent?.length === 0) {
            this.currentHTMLElement.textContent = '|';

            this.currentRectangle.setAttribute('height', `${this.currentHTMLElement.clientHeight}`);
            this.currentHTMLElement.textContent = '';
          }
        }

        // Update handles position
        updateHandles();
        this.updateTextPosition();
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

      this.updateTextPosition();
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
        this.updateTextPosition();
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
          if (!this.currentHTMLElement) {
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
        this.currentHTMLElement?.focus();
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

  updateTextPosition = () => {
    if (this.currentRectangle && this.currentHTMLElement) {
      let rectX = parseFloat(this.currentRectangle.getAttribute('x')!);
      let rectY = parseFloat(this.currentRectangle.getAttribute('y')!);
      const width = parseFloat(this.currentRectangle.getAttribute('width')!);

      this.currentHTMLElement.style.left = `${rectX}px`;
      this.currentHTMLElement.style.top = `${rectY}px`;
      this.currentHTMLElement.style.width = `${width}px`;

      let newHeight = this.currentHTMLElement?.scrollHeight;
      this.currentRectangle.setAttribute('height', newHeight.toString());
      this.itemSelected.positionY = rectY;
      this.itemSelected.positionX = rectX;
      this.itemSelected.height = newHeight;
      this.itemSelected.width= width;
    }
  };

  updateImagePosition = () => {
    if (this.currentRectangle && this.currentHTMLElement) {
      const rectX = parseFloat(this.currentRectangle.getAttribute('x')!);
      const rectY = parseFloat(this.currentRectangle.getAttribute('y')!);
      const width = parseFloat(this.currentRectangle.getAttribute('width')!);
      const height = parseFloat(this.currentRectangle.getAttribute('height')!);

      const margin = 8; // Define the margin between the square and rectangle

      this.itemSelected.positionY = rectY+margin;
      this.itemSelected.positionX = rectX+margin;
      this.itemSelected.height = height-(margin * 2);
      this.itemSelected.width= width-(margin * 2);

      this.currentHTMLElement.style.left = `${this.itemSelected.positionX}px`;
      this.currentHTMLElement.style.top = `${this.itemSelected.positionY}px`;
      this.currentHTMLElement.style.width = `${this.itemSelected.width}px`;
      this.currentHTMLElement.style.height = `${this.itemSelected.height}px`;
    }
  };

  selectImage(file: any, photo: HTMLInputElement) {
    if (file.target.files && file.target.files[0]) {
      this.showBackground = false;
      this.shapeType = 'image';
      this.isDrawing = true;
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const src = event.target.result;
        photo.value = '';
        this.openImageCropper(src);
      }

      reader.readAsDataURL(file.target.files[0]);
    }
  }

  backgroundImage(file: any, photo: HTMLInputElement) {
    if (file.target.files && file.target.files[0]) {
      this.showBackground = true;
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const src = event.target.result;
        photo.value = '';
        this.openImageCropper(src);
      }

      reader.readAsDataURL(file.target.files[0]);
    }
  }

  generateBarcode() {
    this.isDrawing = true;
    this.shapeType = 'barcode';
    this.showBackground = false;
    this.imageElement = document.createElement('img');
    this.imageElement.width = 300;
    this.imageElement.classList.add('barcode', 'pointer-events-none');
    this.body.appendChild(this.imageElement);
    JsBarcode(".barcode", "123456789", {
      format: "code128",
      displayValue: false
    });

    this.imageElement.onload = () => {
      this.barcode(this.imageElement!.src);
      this.body.removeChild(this.imageElement!);
    }
  }

  imageBox(imageString: string) {
    if (this.removeListeners) {
      this.removeListeners();
    }

    this.showBackground = false;
    this.currentSVGElement = null;
    this.currentHTMLElement = null;
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
      this.currentRectangle.setAttribute('x', `16`);
      this.currentRectangle.setAttribute('y', `16`);
      this.selectedItemId = id;
      this.svgCanvas.appendChild(rect);
      let imageContainer = createImageBox(id);

      rect?.addEventListener('mousedown', (e) => {
        this.imageBox(imageString);
        this.svgCanvas.style.cursor = 'move';
        this.selectedItemId = id;
        this.currentRectangle = rect;
        this.currentHTMLElement = imageContainer;
        this.itemSelected = this.elements.find(element => element.id === id) as ElementInfo;
        this.updateImagePosition();
        updateHandles(); // Update handles when rectangle is clicked
      });

      rect?.addEventListener('click', (e) => {
        e.stopPropagation();
      })

      if (!handleAdd) {
        addResizeHandles();
        handleAdd = true;
      }
    };

    const createImageBox = (id: any): HTMLElement | null => {
      if (this.currentRectangle) {
        let container = document.createElement('div');
        container.style.position = 'absolute';
        container.id = `${id}imageBox`;
        this.currentHTMLElement = container;
        const image = document.createElement('img');
        image.width = 300;
        container.classList.add('pointer-events-none');
        image.src = imageString;
        this.itemSelected = {
          id: id,
          positionX: startX,
          positionY: startY,
          type: 'image',
          value: 'add-image.svg',
          width: image.width,
          height: image.height
        };

        this.elements.push(this.itemSelected);
        this.body.appendChild(image);
        image.onload = () => {
          this.itemSelected.width = image.width;
          this.itemSelected.height = image.height;
          this.currentRectangle!.setAttribute('width', `${this.itemSelected.width}`);
          this.currentRectangle!.setAttribute('height', `${this.itemSelected.height}`);
          container.style.backgroundImage = `url('${imageString}')`;
          container.style.backgroundSize = '100% 100%';
          container.style.imageRendering = 'crisp-edges';
          container.style.backgroundRepeat = 'no-repeat';
          container.style.zIndex = '1';
          this.isDrawing = false;
          this.shapeType = 'cursor';
          this.svgCanvas.style.cursor = 'default';
          this.svgCanvas.parentElement?.appendChild(container);
          this.body.removeChild(image);
          this.updateImagePosition();
          updateHandles();
        }
        return container;
      }
      return null;
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

      // Update rectangle's attributes
      if (this.currentRectangle) {
        this.currentRectangle.setAttribute('x', Math.min(startX, currentX).toString());
        this.currentRectangle.setAttribute('y', startY.toString()); // Height is fixed, so y coordinate stays the same
        this.currentRectangle.setAttribute('width', Math.abs(width).toString());
        // Update handles position
        // updateHandles();
        this.updateImagePosition();
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
        this.updateImagePosition();
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
        this.updateImagePosition();
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.target instanceof SVGRectElement) {
        if (e.target.classList.contains('resize-handle')) {
          resizeDirection = (e.target as SVGRectElement).getAttribute('data-resize')!;
          isResizing = true;
        } else {
          startDragging(e);
        }
      } else {
        if (this.shapeType !== 'cursor' && this.isDrawing) {
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

    if (this.isDrawing) {
      createRectangle();
    }

  }

  qrcode() {
    if (this.removeListeners) {
      this.removeListeners();
    }

    this.currentSVGElement = null;
    this.showBackground = false;
    this.currentHTMLElement = null;
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
        this.qrcode();
        this.svgCanvas.style.cursor = 'move';
        this.selectedItemId = id;
        this.currentRectangle = rect;
        this.currentSVGElement = poly;
        this.itemSelected = this.elements.find(element => element.id === id) as ElementInfo;
        updateSquare();
        updateHandles(); // Update handles when rectangle is clicked
      });

      rect?.addEventListener('click', (e) => {
        e.stopPropagation();
      })
    };

    const createSquare = (id: any): SVGElement | null => {
      if (this.currentRectangle) {
        this.itemSelected = {
          id: id,
          positionX: startX,
          positionY: startY,
          type: 'qrcode',
          value: '123456789',
        };
        this.elements.push(this.itemSelected);

        const img = document.createElementNS(SVG_NAMESPACE, 'image');
        QRCode.toDataURL('12345678').then((url) => {
          img.setAttribute('id', `${id}qrcode`);
          img.style.pointerEvents = 'none';
          img.setAttribute('href', url);
          img.setAttribute('x', `${startX}`);
          img.setAttribute('y', `${startY}`);
          this.svgCanvas.appendChild(img);
          console.log(img.clientWidth);
          this.itemSelected.width = img.clientWidth;
          this.itemSelected.height = img.clientHeight;
          this.currentRectangle!.setAttribute('width', Math.abs(img.clientWidth).toString());
          this.currentRectangle!.setAttribute('height', Math.abs(img.clientHeight).toString());
          // Append the image directly to the SVG canvas
        });

        this.currentSVGElement = img;

        return img;
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
        this.itemSelected.positionY = rectY+margin;
        this.itemSelected.positionX = rectX+margin;
        this.itemSelected.height = height-(margin * 2);
        this.itemSelected.width= width-(margin * 2);

        this.currentSVGElement.setAttribute('width', `${Math.abs(this.itemSelected.width)}`);
        this.currentSVGElement.setAttribute('height', `${Math.abs(this.itemSelected.height)}`);
        this.currentSVGElement.setAttribute('x', `${this.itemSelected.positionX}`);
        this.currentSVGElement.setAttribute('y', `${this.itemSelected.positionY}`);
      }
    };

    const addResizeHandles = () => {
      if (this.currentRectangle) {
        const handles = [
          // { position: 'top-left', cursor: 'nwse-resize' },
          // { position: 'top-right', cursor: 'nesw-resize' },
          // { position: 'bottom-left', cursor: 'nesw-resize' },
          { position: 'bottom-right', cursor: 'nwse-resize' },
          // { position: 'top', cursor: 'ns-resize' },
          // { position: 'bottom', cursor: 'ns-resize' },
          // { position: 'left', cursor: 'ew-resize' },
          // { position: 'right', cursor: 'ew-resize' }
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

      // Update rectangle's attributes
      if (this.currentRectangle) {
        this.currentRectangle.setAttribute('x', Math.min(startX, currentX).toString());
        this.currentRectangle.setAttribute('y', Math.min(startY, currentY).toString());
        this.currentRectangle.setAttribute('width', Math.abs(width).toString());
        this.currentRectangle.setAttribute('height', Math.abs(width).toString());

        // Update handles position
        updateSquare();
      }
    };

    const updateRectangleSize = (e: MouseEvent) => {
      if (this.currentRectangle) {
        const adjusted = getAdjustedCoordinates(e); // Get adjusted coordinates

        const rectX = parseFloat(this.currentRectangle.getAttribute('x')!);

        switch (resizeDirection) {
          case 'bottom-right':
            const newBottomRightWidth = Math.max(adjusted.x - rectX, 0);

            this.currentRectangle.setAttribute('width', newBottomRightWidth.toString());
            this.currentRectangle.setAttribute('height', newBottomRightWidth.toString());
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

  barcode(imageString: string) {
    if (this.removeListeners) {
      this.removeListeners();
    }

    this.showBackground = false;
    this.currentHTMLElement = null;
    this.currentSVGElement = null;
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
      this.currentRectangle.setAttribute('x', `16`);
      this.currentRectangle.setAttribute('y', `16`);
      this.selectedItemId = id;
      this.svgCanvas.appendChild(rect);
      let imageContainer = createImageBox(id);


      rect?.addEventListener('mousedown', (e) => {
        this.barcode(imageString);
        this.svgCanvas.style.cursor = 'move';
        this.selectedItemId = id;
        this.currentRectangle = rect;
        this.currentHTMLElement = imageContainer;
        this.itemSelected = this.elements.find(element => element.id === id) as ElementInfo;
        this.updateImagePosition();
        updateHandles(); // Update handles when rectangle is clicked
      });

      rect?.addEventListener('click', (e) => {
        e.stopPropagation();
      })

      if (!handleAdd) {
        addResizeHandles();
        handleAdd = true;
      }
    };

    const createImageBox = (id: any): HTMLElement | null => {
      if (this.currentRectangle) {

        let container = document.createElement('div');
        container.style.position = 'absolute';
        container.id = `${id}barcode`;
        this.currentHTMLElement = container;
        const image = document.createElement('img');
        image.width = 300;
        container.classList.add('pointer-events-none');
        image.src = imageString;
        this.itemSelected = {
          id: id,
          positionX: startX,
          positionY: startY,
          type: 'barcode',
          value: '123456789',
          width: image.width,
          height: image.height
        };

        this.elements.push(this.itemSelected);

        image.onload = () => {
          this.body.appendChild(image);
          this.currentRectangle!.setAttribute('width', `${this.itemSelected.width}`);
          this.currentRectangle!.setAttribute('height', `${this.itemSelected.height}`);
          container.style.backgroundImage = `url('${imageString}')`;
          container.style.backgroundSize = '100% 100%';
          container.style.imageRendering = 'pixelated';
          container.style.backgroundRepeat = 'no-repeat';
          this.isDrawing = false;
          this.shapeType = 'cursor';
          this.svgCanvas.style.cursor = 'default';
          this.svgCanvas.parentElement?.appendChild(container);
          this.body.removeChild(image);
          this.updateImagePosition();
          updateHandles();
        }
        return container;
      }
      return null;
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

      // Update rectangle's attributes
      if (this.currentRectangle) {
        this.currentRectangle.setAttribute('x', Math.min(startX, currentX).toString());
        this.currentRectangle.setAttribute('y', startY.toString()); // Height is fixed, so y coordinate stays the same
        this.currentRectangle.setAttribute('width', Math.abs(width).toString());
        // Update handles position
        // updateHandles();
        this.updateImagePosition();
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
        this.updateImagePosition();
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
        this.updateImagePosition();
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.target instanceof SVGRectElement) {
        if (e.target.classList.contains('resize-handle')) {
          resizeDirection = (e.target as SVGRectElement).getAttribute('data-resize')!;
          isResizing = true;
        } else {
          startDragging(e);
        }
      } else {
        if (this.shapeType !== 'cursor' && this.isDrawing) {
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

    if (this.isDrawing) {
      createRectangle();
    }

  }

  createText() {
    this.shapeType = 'text box';
    this.showBackground = false;
    this.textbox();
  }

  createQRcode () {
    this.shapeType = 'qrcode';
    this.showBackground = false;
    this.qrcode();
  }

  updateTextColor(color: string) {
    if (this.currentHTMLElement) {
      this.currentHTMLElement.style.color = color;
    }
  }

  updateTextBgColor(color: string) {
    if (this.currentHTMLElement) {
      this.currentHTMLElement.style.backgroundColor = color;
    }
  }

  updateTextSize(data: number) {
    if (this.currentHTMLElement) {
      this.currentHTMLElement.style.fontSize = `${data}px`;
      this.updateTextPosition();
    }
  }

  updateTextData(data: string) {
    if (this.currentHTMLElement || this.currentSVGElement) {
      switch (this.itemSelected.type) {
       case 'text box':
         this.currentHTMLElement!.textContent = data;
         break;
        case "barcode":
          if (this.isDrawing) {
            return;
          }
          this.imageElement = document.createElement('img');
          this.imageElement.width = 300;
          this.imageElement.classList.add('barcode', 'pointer-events-none');
          this.body.appendChild(this.imageElement);
          JsBarcode(".barcode", data, {
            format: "code128",
            displayValue: false
          });

          this.currentHTMLElement!.style.backgroundImage = `url('${this.imageElement.src}')`;
          this.body.removeChild(this.imageElement);
          break;
        case "qrcode":
          if (this.isDrawing) {
            return;
          }
          QRCode.toDataURL(data).then((url) => {
            this.currentSVGElement!.setAttribute('href', url);
          })
          break;
      }
    }
  }

  updateTextAlignment(data: 'left' | 'center' | 'right') {
    if (this.currentHTMLElement) {
      this.currentHTMLElement.style.textAlign = data;
      this.itemSelected.textAlign = data;
    }
  }

  updateTextDecoThickness(data: number) {
    if (this.currentHTMLElement) {
      this.currentHTMLElement.style.textDecorationThickness = `${data}px`;
    }
  }

  updateTextDecoStyle(data: string) {
    if (this.currentHTMLElement) {
      this.currentHTMLElement.style.textDecorationStyle = data;
    }
  }

  updateTextDecoLine(data: string) {
    if (this.currentHTMLElement) {
      this.currentHTMLElement.style.textDecorationLine = data;
    }
  }

  updateTextFontStyle(data: string) {
    if (this.currentHTMLElement) {
      this.currentHTMLElement.style.fontStyle = data;
    }
  }

  updateTextFontWeight(data: number) {
    if (this.currentHTMLElement) {
      this.currentHTMLElement.style.fontWeight = `${data}`;
    }
  }

  getSelectedImage() {
    if (this.currentHTMLElement) {
      return  this.currentHTMLElement.style.backgroundImage;
    }
    return null;
  }

  updatePhoto(file: any, photo: HTMLInputElement) {
    if (file.target.files && file.target.files[0]) {
      this.shapeType = 'image';
      this.isUpdate = true;
      this.isDrawing = true;
      const reader = new FileReader();
      reader.onload = (event: any) => {
        photo.value = '';
        this.openImageCropper(event.target.result)
      }

      reader.readAsDataURL(file.target.files[0]);
    }
  }

  closeCropper = () => {
    this.cropper.destroy()
    this.cropModal.close();
  }

  openImageCropper =(image: string) => {
    this.cropModal = this.modalService.open({
      content: this.cropperModal,
      width: 'custom',
    });

    timer(500).subscribe({
      next: _ => {
        const cropElement = document.getElementById('processCrop') as HTMLImageElement;
        cropElement.src = image;
        this.cropper = new Cropper(cropElement, {

        });
      }
    })
  }

  processCrop = () => {
    let dataUrl = this.cropper.getCroppedCanvas({ imageSmoothingQuality: 'high'}).toDataURL('image/png');
    if (!this.showBackground) {
      if (this.isUpdate) {
        this.imageElement = document.createElement('img');
        this.imageElement.width = 300;
        this.imageElement.classList.add('pointer-events-none');
        this.body.appendChild(this.imageElement);
        this.imageElement.src = dataUrl;
        const getContainer = document.getElementById(`${this.itemSelected.id}imageBox`) as HTMLElement;
        getContainer.style.backgroundImage = `url('${this.imageElement.src}')`;
        this.body.removeChild(this.imageElement);
        this.isUpdate = false;
      } else {
        this.imageBox(dataUrl);
      }
    } else {
      this.templateInfo.backgroundImage = `url('${dataUrl}')`;
    }
    this.cropper.destroy();
    this.cropModal.close();
  }
}
