import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {animate} from "motion";

@Component({
  selector: 'sc-accordion',
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.css'
})
export class AccordionComponent implements AfterViewInit {
  @Input() isCollapsed = false;

  @ViewChild('content', { static: false }) content!: ElementRef;

  toggleAccordion() {
    this.isCollapsed = !this.isCollapsed;
    const contentEl = this.content.nativeElement;

    if (this.isCollapsed) {
      animate(contentEl, { height: [0, contentEl.scrollHeight + 'px'], opacity: [0, 1] }, { duration: 0.3, ease: "easeOut" });
    } else {
      animate(contentEl, { height: [contentEl.scrollHeight + 'px', 0], opacity: [1, 0] }, { duration: 0.3, ease: 'easeIn' });
    }
  }

  ngAfterViewInit(): void {
    const contentEl = this.content.nativeElement;
    if (this.isCollapsed) {
      animate(contentEl, { height: [0, contentEl.scrollHeight + 'px'], opacity: [0, 1] }, { duration: 0.3, ease: "easeOut" });
    } else {
      animate(contentEl, { height: [contentEl.scrollHeight + 'px', 0], opacity: [1, 0] }, { duration: 0.3, ease: 'easeIn' });
    }
  }
}
