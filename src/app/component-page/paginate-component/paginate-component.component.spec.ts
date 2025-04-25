import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginateComponentComponent } from './paginate-component.component';

describe('PaginateComponentComponent', () => {
  let component: PaginateComponentComponent;
  let fixture: ComponentFixture<PaginateComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaginateComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginateComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
