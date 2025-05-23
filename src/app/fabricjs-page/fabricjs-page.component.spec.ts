import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FabricjsPageComponent } from './fabricjs-page.component';

describe('FabricjsPageComponent', () => {
  let component: FabricjsPageComponent;
  let fixture: ComponentFixture<FabricjsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FabricjsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FabricjsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
