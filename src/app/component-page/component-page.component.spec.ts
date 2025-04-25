import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentPageComponent } from './component-page.component';

describe('ComponentPageComponent', () => {
  let component: ComponentPageComponent;
  let fixture: ComponentFixture<ComponentPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComponentPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
