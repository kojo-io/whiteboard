import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import { highlightAll } from '@speed-highlight/core';

@Component({
  selector: 'app-numeric-component',
  templateUrl: './numeric-component.component.html',
  styleUrl: './numeric-component.component.css'
})
export class NumericComponentComponent implements AfterViewInit {
  editor = '<div>\n' +
    '  <NumberInput name="search" [required]="true"></NumberInput>\n' +
    '</div>\n' +
    '<div>\n' +
    '  <NumberInput name="search" [prefixTemplate]="search"  [required]="true"></NumberInput>\n' +
    '  <ng-template #search>\n' +
    '    <i class="material-icons text-xl text-[#9CA3AF]">tag</i>\n' +
    '  </ng-template>\n' +
    '</div>\n' +
    '<div>\n' +
    '  <Label for="count">Counter</Label>\n' +
    '  <NumberInput id="count" name="count" [readOnly]="true" [required]="true" [placeholder]="\'Counter\'"></NumberInput>\n' +
    '</div>';


  @ViewChild('codePoint', {static: true}) codePoint!: ElementRef<HTMLElement>;
  ngAfterViewInit(): void {
    highlightAll({hideLineNumbers: false});
  }

}
