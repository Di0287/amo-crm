import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsStatusComponent } from './leads-status.component';

describe('LeadsComponent', () => {
  let component: LeadsStatusComponent;
  let fixture: ComponentFixture<LeadsStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadsStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadsStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
