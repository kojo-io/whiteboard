import {Injectable, Injector} from '@angular/core';
import {Overlay, OverlayConfig, OverlayRef} from "@angular/cdk/overlay";
import {ComponentPortal} from "@angular/cdk/portal";
import {Drawer} from "./drawer";
import {DrawerRef} from "./drawer-ref";
import {DrawerComponent} from "./drawer.component";

@Injectable({
  providedIn: 'root'
})

export class DrawerService {
  constructor(private overlay: Overlay, private injector: Injector) {}

  open<R = any, T = any>(drawer: Drawer): DrawerRef<R> {
    // Create overlay with backdrop configurations
    const overlayRef = this.createOverlay();

    // Create a reference to interact with the modal instance
    const drawerRef = new DrawerRef<R, T>(overlayRef, drawer);

    // Create a custom injector for the modal component
    const injector = this.createInjector(drawerRef);

    // Attach the modal component to the overlay
    this.attachDrawerComponent(overlayRef, injector);

    return drawerRef;
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

  private attachDrawerComponent(overlayRef: OverlayRef, injector: Injector): void {
    const drawerPortal = new ComponentPortal(DrawerComponent, null, injector);
    overlayRef.attach(drawerPortal);
  }

  private createInjector(drawerRef: DrawerRef): Injector {
    return Injector.create({
      providers: [{ provide: DrawerRef, useValue: drawerRef }],
      parent: this.injector,
    });
  }
}
