import {
  AfterContentInit,
  Component, ElementRef,
  EventEmitter, forwardRef, HostListener,
  inject,
  Input,
  OnInit,
  Output, ViewChild
} from '@angular/core';
import {TabItem} from "./types/tab-item";
import {animate, transition, trigger} from "@angular/animations";
import {TabService} from "./tab.service";
import {ComponentService} from "../component.service";
import {timer} from "rxjs";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'sc-tabs',
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.css',
  providers: [
    TabService,
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => TabComponent)
    }
  ],
  animations: [
    trigger('moveActiveBg', [
      transition('* => *', [animate('300ms ease-in-out')])
    ])
  ]
})

export class TabComponent implements OnInit, AfterContentInit , ControlValueAccessor {
  @Input() stretch: '' | undefined = undefined;
  @Input() type: 'line' | 'solid' = 'solid';
  @Input() selected: any;
  @Output() onSelected = new EventEmitter();
  contentInitialized = false;
  activeWidth: number = 0;
  id = ComponentService.uuid();
  tabService = inject(TabService);
  onChange = (_: any) => {};
  onTouched = () => {};
  private selectedButton!: HTMLElement;

  @ViewChild('activeBg', { static: true }) activeBg!: ElementRef<HTMLDivElement>;

  updateActiveBackground(button: HTMLElement) {
    const buttonRect = button.getBoundingClientRect();
    const containerRect = button.parentElement!.parentElement!.getBoundingClientRect();
    // Calculate position and width for the active background
    let leftOffset = buttonRect.left - containerRect.left + 2;

    this.activeWidth = buttonRect.width - 4;

    // Directly set initial styles without animation
    if (this.activeBg) {
      this.activeBg.nativeElement.style.width =`${this.activeWidth}px`;
      this.activeBg.nativeElement.style.left = `${leftOffset}px`;
    }
  }

  @HostListener('window:resize')
  onWindowResize() {
    if (this.selectedButton) {
      this.updateActiveBackground(this.selectedButton);
    }
  }

  ngOnInit(): void {
    this.tabService.setType.next(this.type);
    this.tabService.setStretched.next(this.stretch);
    this.tabService.setValue.subscribe({
      next: result => {
        this.onSelected.emit(result);
        this.onChange(result);
      }
    })

    this.tabService.selected.subscribe({
      next: result => {
        this.selectedButton = result;
        this.updateActiveBackground(result);
      }
    });
  }

  ngAfterContentInit(): void {
    timer(200).subscribe({
      next: _ => {
        this.contentInitialized = true;
      }
    })
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(obj: any): void {
    if (obj) {
      this.selected = obj;
      timer( this.contentInitialized ? 0 : 200).subscribe({
        next: _ => {
          this.tabService.setValue.next(obj);
        }
      })
    }
  }
}
