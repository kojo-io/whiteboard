import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccordionTitleComponent } from './accordion-title.component';

describe('AccordionTitleComponent', () => {
  let component: AccordionTitleComponent;
  let fixture: ComponentFixture<AccordionTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccordionTitleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccordionTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
