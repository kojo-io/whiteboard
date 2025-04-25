import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailEditorComponent } from './mail-editor.component';

describe('EditorComponent', () => {
  let component: MailEditorComponent;
  let fixture: ComponentFixture<MailEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MailEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MailEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
