import { Subject, timer } from 'rxjs';
import { OverlayRef } from '@angular/cdk/overlay';
import { Modal } from './modal';
import { OverlayCloseEvent } from '../overlay-close-event';

export class ModalRef<R = any, T = any> {
  // Private subjects for modal events
  private readonly _afterClosed$ = new Subject<OverlayCloseEvent<R | undefined | null>>();
  private readonly _afterOpened$ = new Subject<T | undefined>();

  // Public observables for the modal events
  afterClosed$ = this._afterClosed$.asObservable();
  afterOpened$ = this._afterOpened$.asObservable();

  constructor(private overlay: OverlayRef, public modal: Modal) {
    // Subscribe to backdrop click events
    this.handleBackdropClick();
  }

  /**
   * Public method to close the modal.
   * @param data - Optional data to pass when closing the modal.
   */
  close(data?: R): void {
    this._close('close', data);
  }

  /**
   * Public method to open the modal.
   * Emits the content data to the afterOpened$ observable.
   * @param data - Optional data to pass when opening the modal.
   */
  open(data?: T): void {
    this._afterOpened$.next(data);
  }

  /**
   * Private method to close the modal with specified event type and data.
   * Disposes of the overlay and completes the observables.
   * @param type - The type of event causing the modal to close.
   * @param data - Optional data to pass when closing the modal.
   */
  private _close(type: 'backdropClick' | 'close', data: R | undefined | null): void {
    this._afterClosed$.next({ type, data });
    timer(200).subscribe(() => {
      this.overlay.dispose();
      this._afterClosed$.complete();
    });
  }

  /**
   * Private method to handle backdrop click events.
   * Closes the modal if `modal.backdropClose` is set to true.
   */
  private handleBackdropClick(): void {
    this.overlay.backdropClick().subscribe(() => {
      if (this.modal.backdropClose === true || this.modal.backdropClose === undefined) {
        this._close('backdropClick', null);
      }
    });
  }
}
