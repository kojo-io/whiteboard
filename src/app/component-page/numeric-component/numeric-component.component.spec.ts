import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumericComponentComponent } from './numeric-component.component';

describe('NumericComponentComponent', () => {
  let component: NumericComponentComponent;
  let fixture: ComponentFixture<NumericComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NumericComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NumericComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
