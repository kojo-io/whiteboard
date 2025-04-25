import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter, inject,
  Input, NgZone, OnChanges,
  OnDestroy,
  OnInit,
  Output, SimpleChanges,
  ViewChild
} from '@angular/core';
import * as monacoApi from 'monaco-editor';

@Component({
  selector: 'app-mail-editor',
  templateUrl: './mail-editor.component.html',
  styleUrl: './mail-editor.component.css'
})
export class MailEditorComponent implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('container', { static: true }) container!: ElementRef<HTMLDivElement>;
  ngZone = inject(NgZone);
  editor!: monacoApi.editor.IStandaloneCodeEditor;
  private ignoreNextChange = false;
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();

  ngAfterViewInit() {
    this.editor = monacoApi.editor.create(this.container.nativeElement, {
      value: ``,
      language: 'html',
      theme: 'vs-dark',
      automaticLayout: true,
      // wordWrap: 'on',
      // minimap: {
      //   enabled: false // This completely hides the minimap
      // }
    });

    this.editor.onDidChangeModelContent(() => {
      this.ngZone.run(() => {
        this.valueChange.emit(this.editor.getValue());
      });
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value'] && this.editor && changes['value'].currentValue !== this.editor.getValue()) {
      this.ignoreNextChange = true;
      this.editor.setValue(changes['value'].currentValue);
    }
  }

  ngOnDestroy() {
    this.editor?.dispose();
  }
}
