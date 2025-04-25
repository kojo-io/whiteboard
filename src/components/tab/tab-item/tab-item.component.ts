import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, ElementRef, HostBinding, inject,
  Inject,
  Input, OnInit, ViewChild
} from '@angular/core';
import {TabService} from "../tab.service";
import {ComponentService} from "../../component.service";

@Component({
  selector: 'sc-tab-item',
  templateUrl: './tab-item.component.html',
  styleUrl: './tab-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabItemComponent implements OnInit, AfterContentInit {
  @Input() value: any;
  @Input() disabled = false;
  @Inject(TabService) private tabService = inject(TabService);
  cd = inject(ChangeDetectorRef);
  selected = false;
  stretch = false;
  type: 'line' | 'solid' = 'line';
  id = ComponentService.uuid();

  @HostBinding('class') get classes() {
    return this.stretch ? 'w-full text-center' : '';
  };

  @ViewChild('button', { static: true }) button!: ElementRef<HTMLDivElement>;
  ngOnInit(): void {
  }

  selectItem = () => {
    if (!this.disabled) {
      this.tabService.setValue.next(this.value);
    }
  }

  ngAfterContentInit(): void {
    this.tabService.setType.subscribe({
      next: result => {
        this.type = result;
        this.cd.detectChanges();
      }
    })

    this.tabService.setStretched.subscribe({
      next: result => {
        if(result === '') {
          this.stretch = true;
        }
      }
    })

    this.tabService.setValue.subscribe({
      next: result => {
        if (result === this.value) {
          if (!this.selected) {
            this.selected = true;
            this.tabService.select(this.button.nativeElement);
            this.cd.detectChanges();
          }
        } else {
          if (this.selected) {
            this.selected = false;
            this.cd.detectChanges();
          }
        }
      }
    })
  }
}
