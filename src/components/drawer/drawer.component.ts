import {AfterViewInit, Component, Input, OnDestroy, OnInit, TemplateRef, Type} from '@angular/core';
import {DrawerRef} from "./drawer-ref";
import {ComponentService} from "../component.service";
import {Subject, timer} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.css',
  animations: [
    trigger('drawerState', [
      // Closed state with position-based translation
      state('closed', style({ transform: 'translateX({{ closedPosition }})' }), { params: { closedPosition: '-100%' } }),
      // Open state with no translation (visible in viewport)
      state('open', style({ transform: 'translateX(0)' })),

      // Transition from closed to open
      transition('closed => open', [
        animate('300ms ease-out')
      ]),
      // Transition from open to closed
      transition('open => closed', [
        animate('300ms ease-in')
      ])
    ])
  ]
})
export class DrawerComponent implements OnInit, AfterViewInit, OnDestroy {
  id = ComponentService.uuid();
  @Input() position: 'left' | 'right' = 'left'; // Left or right position
  @Input() width: string = '80%';
  contentType!: 'template' | 'string' | 'component';
  content!: string | TemplateRef<any> | Type<any>;
  drawerSize: 'normal' | 'large' | 'fullscreen' | undefined = 'normal';
  context: any;
  drawerCss = '';
  open = false;
  rounded = true;

  private destroy$ = new Subject<void>();

  constructor(private readonly ref: DrawerRef) {
    this.subscribeToDrawerEvents();
  }

  ngOnInit(): void {
    this.initializeDrawerProperties();
    this.drawerCss = this.getDrawerSizeCss();
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

  private subscribeToDrawerEvents(): void {
    this.ref.afterClosed$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.closeDrawer();
      });
  }

  private initializeDrawerProperties(): void {
    const modal = this.ref.drawer;
    this.content = modal.content;
    this.drawerSize = modal.size ?? 'normal';
    this.rounded = modal.rounded ?? true;
    this.position = modal.position ?? 'right';
    this.width = modal.width ?? '80%'; // Set dynamic width
  }

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

  private getDrawerSizeCss(): string {
    switch (this.drawerSize) {
      case 'fullscreen':
        return 'w-screen h-screen';
      case 'large':
        return 'h-full lg:w-11/12';
      case 'normal':
      default:
        return 'h-full'; // Default to full width
    }
  }

  private animateOpenState(): void {
    timer(10).subscribe(() => {
      this.open = true;
    });
  }

  private closeDrawer(): void {
    this.open = false;
  }
}
