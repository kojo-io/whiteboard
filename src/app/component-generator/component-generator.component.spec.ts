import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentGeneratorComponent } from './component-generator.component';

describe('ComponentGeneratorComponent', () => {
  let component: ComponentGeneratorComponent;
  let fixture: ComponentFixture<ComponentGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComponentGeneratorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
