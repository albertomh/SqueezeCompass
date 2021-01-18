import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstituentGridComponent } from './constituent-grid.component';

describe('ConstituentGridComponent', () => {
  let component: ConstituentGridComponent;
  let fixture: ComponentFixture<ConstituentGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConstituentGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstituentGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
