import {AfterViewInit, Directive, ElementRef, HostListener, Input, Output} from '@angular/core';
import {arrow, computePosition, flip, offset, shift} from "@floating-ui/dom";

@Directive({
  selector: '[DropDown]'
})
export class DropDownDirective implements AfterViewInit{
  @Input() menu!: HTMLElement;
  @Input() position : 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end' = 'bottom-end';
  @Input() padding = 6;
  @Input() offSet = 6;
  @Input() disabled = false;
  @Input() showArrow = false;
  constructor(private el: ElementRef) { }

  arrowElement!: HTMLElement;

  contextMenu() {
    computePosition(this.el.nativeElement, this.menu, {
      placement: this.position,
      middleware: [
        flip(),
        offset(this.offSet),
        shift({padding: this.padding}),
        arrow({element: this.arrowElement}),
      ]
    }).then(({x, y, placement, middlewareData}) => {
      Object.assign(this.menu.style, {
        left: `${x}px`,
        top: `${y}px`
      });

      // @ts-ignore
      const {x: arrowX, y: arrowY} = middlewareData.arrow;

      const staticSide = {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right',
      }[placement.split('-')[0]];

      Object.assign(this.arrowElement.style, {
        left: arrowX != null ? `${arrowX}px` : '',
        top: arrowY != null ? `${arrowY}px` : '',
        right: '',
        bottom: '',
        // @ts-ignore
        [staticSide]: '-4px',
      });
    })
  }

  ngAfterViewInit(): void {
    document.addEventListener('click', (_) => {
      const ele = document.getElementsByClassName('dropdown-menu-list');
      for (let i = 0; i< ele.length;i++) {
        if (!ele.item(i)?.classList.contains('hidden')) {
          ele.item(i)?.classList.add('hidden')
        }
      }
    })
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    if (this.disabled) return;

    event.stopImmediatePropagation();
    const ele = document.getElementsByClassName('dropdown-menu-list');
    for (let i = 0; i< ele.length;i++) {
      if (!ele.item(i)?.classList.contains('hidden')) {
        ele.item(i)?.classList.add('hidden');
      }
    }
    this.menu.classList.toggle('hidden');
    this.arrowElement = document.createElement('div');
    this.arrowElement.classList.add('absolute', !this.showArrow ? 'bg-transparent': 'bg-white', 'w-[16px]', 'h-[16px]', 'rotate-45', 'z-[999]',  !this.showArrow ? 'border-none': 'border-t', !this.showArrow ? '\'border-none': 'border-l');
    this.menu.appendChild(this.arrowElement);
    this.contextMenu();
  }

  @HostListener('window:resize')
  onResize() {
    this.contextMenu();
  }
}
