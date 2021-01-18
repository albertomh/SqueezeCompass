import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstituentGridFilterComponent } from './constituent-grid-filter.component';

describe('ConstituentGridFilterComponent', () => {
  let component: ConstituentGridFilterComponent;
  let fixture: ComponentFixture<ConstituentGridFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConstituentGridFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstituentGridFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
