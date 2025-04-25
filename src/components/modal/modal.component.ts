import { AfterViewInit, Component, OnInit, OnDestroy, TemplateRef, Type } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ModalRef } from './modal-ref';
import { ComponentService } from '../component.service';

@Component({
  selector: 'Modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  animations: [
    trigger('modalState', [
      state('open', style({ transform: 'scale(1)', opacity: 1 })),
      state('closed', style({ transform: 'scale(0)', opacity: 0 })),
      transition('closed => open', [
        style({ transform: 'scale(0)', opacity: 0 }),
        animate('150ms ease-in')
      ]),
      transition('open => closed', [
        animate('150ms ease-out', style({ transform: 'scale(0)', opacity: 0 }))
      ])
    ])
  ]
})
export class ModalComponent implements OnInit, AfterViewInit, OnDestroy {
  id = ComponentService.uuid(); // Generates a unique ID for the modal instance.
  contentType!: 'template' | 'string' | 'component';
  content!: string | TemplateRef<any> | Type<any>;
  modalSize: 'normal' | 'large' | 'fullscreen' | undefined = 'normal';
  context: any;
  modalCss = '';
  open = false;
  height: string = '';
  width: 'auto' | 'custom' | undefined = 'auto';
  center = true;
  rounded = true;

  // Private subject to handle component unsubscriptions
  private destroy$ = new Subject<void>();

  constructor(private readonly ref: ModalRef) {
    this.subscribeToModalEvents();
  }

  ngOnInit(): void {
    this.initializeModalProperties();
    this.modalCss = this.getModalSizeCss();
    this.determineContentType();
  }

  ngAfterViewInit(): void {
    this.ref.open(this.content);
    this.animateOpenState();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Subscribes to the modal close event to update the UI and handle state transitions.
   */
  private subscribeToModalEvents(): void {
    this.ref.afterClosed$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.closeModal();
      });
  }

  /**
   * Initializes the modal properties based on the input modal configuration.
   */
  private initializeModalProperties(): void {
    const modal = this.ref.modal;
    this.content = modal.content;
    this.modalSize = modal.size ?? 'normal';
    this.center = modal.center ?? true;
    this.height = modal.height ?? 'h-auto';
    this.rounded = modal.rounded ?? true;
    this.width = modal.width ?? 'auto';
  }

  /**
   * Determines the content type for the modal: template, string, or component.
   */
  private determineContentType(): void {
    if (typeof this.content === 'string') {
      this.contentType = 'string';
    } else if (this.content instanceof TemplateRef) {
      this.contentType = 'template';
      this.context = { close: this.ref.close.bind(this.ref) };
    } else {
      this.contentType = 'component';
    }
  }

  /**
   * Returns the CSS classes for the modal based on the size.
   */
  private getModalSizeCss(): string {
    switch (this.modalSize) {
      case 'fullscreen':
        return 'w-screen h-screen';
      case 'large':
        return 'w-full lg:w-11/12';
      case 'normal':
      default:
        return this.width == "auto" ? 'w-full lg:w-[544px]' : 'w-full lg:w-auto';
    }
  }

  /**
   * Animates the modal's open state with a delay to ensure smooth transitions.
   */
  private animateOpenState(): void {
    // Set a delay to trigger the animation properly after view is initialized
    timer(10).subscribe({
      next: () => {
        this.open = true;
      },
    });
  }

  /**
   * Closes the modal and triggers the close animation state.
   */
  private closeModal(): void {
    this.open = false;
  }
}
