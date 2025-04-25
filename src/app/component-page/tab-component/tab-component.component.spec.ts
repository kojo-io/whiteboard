import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabComponentComponent } from './tab-component.component';

describe('TabComponentComponent', () => {
  let component: TabComponentComponent;
  let fixture: ComponentFixture<TabComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
