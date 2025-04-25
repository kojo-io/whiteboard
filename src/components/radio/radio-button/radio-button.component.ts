import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef, Inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {RadioButtonService} from "../radio-button.service";
import {ComponentService} from "../../component.service";

@Component({
  selector: 'sc-radio-button',
  templateUrl: './radio-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./radio-button.component.scss']
})
export class RadioButtonComponent implements OnInit, OnChanges, OnDestroy {
  @Input() value: any;
  checked = false;
  @Input() id = ComponentService.uuid();
  @Input() disabled = false;
  name: any;

  @ViewChild('inputElement', { static: true }) inputElement!: ElementRef<HTMLInputElement>;
  constructor(@Inject(RadioButtonService) private radioService: RadioButtonService,
              private cd: ChangeDetectorRef,
              private ngZone: NgZone) {
  }

  ngOnDestroy(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
    this.radioService.selected.subscribe({
      next: result => {
        this.checked = result === this.value;
        this.cd.detectChanges();
      }
    })

    this.radioService.setName.subscribe({
      next: result => {
        this.name = result;
      }
    })
  }

  selectItem = (value: any) => {
    this.ngZone.runOutsideAngular(() => {
      value.stopPropagation();
      this.checked = value.target.checked;
      this.radioService.setValue.next(this.checked);
      this.radioService.select(this.value);
    })
  }
}
