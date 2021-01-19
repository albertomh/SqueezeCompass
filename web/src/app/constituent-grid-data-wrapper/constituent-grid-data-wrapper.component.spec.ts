import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstituentGridDataWrapperComponent } from './constituent-grid-data-wrapper.component';

describe('ConstituentGridDataWrapperComponent', () => {
  let component: ConstituentGridDataWrapperComponent;
  let fixture: ComponentFixture<ConstituentGridDataWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConstituentGridDataWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstituentGridDataWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
