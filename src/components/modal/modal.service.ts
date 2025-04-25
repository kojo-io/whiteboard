import { Injectable, Injector } from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { Modal } from './modal';
import { ModalRef } from './modal-ref';
import { ModalComponent } from './modal.component';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(private overlay: Overlay, private injector: Injector) {}

  open<R = any, T = any>(modal: Modal): ModalRef<R> {
    // Create overlay with backdrop configurations
    const overlayRef = this.createOverlay();

    // Create a reference to interact with the modal instance
    const modalRef = new ModalRef<R, T>(overlayRef, modal);

    // Create a custom injector for the modal component
    const injector = this.createInjector(modalRef);

    // Attach the modal component to the overlay
    this.attachModalComponent(overlayRef, injector);

    return modalRef;
  }

  private createOverlay(): OverlayRef {
    const overlayConfig = new OverlayConfig({
      hasBackdrop: true,
      backdropClass: [
        'backdrop-blur-[6px]',
        'bg-gray-400/30',
        'fixed',
        'inset-0',
        'z-[999]'
      ],
      panelClass: 'modal-panel', // Optional: custom class for the panel
    });

    return this.overlay.create(overlayConfig);
  }

  private attachModalComponent(overlayRef: OverlayRef, injector: Injector): void {
    const modalPortal = new ComponentPortal(ModalComponent, null, injector);
    overlayRef.attach(modalPortal);
  }

  private createInjector(modalRef: ModalRef): Injector {
    return Injector.create({
      providers: [{ provide: ModalRef, useValue: modalRef }],
      parent: this.injector,
    });
  }
}
