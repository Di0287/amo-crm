import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadAddComponent } from './lead-add.component';

describe('LeadAddComponent', () => {
  let component: LeadAddComponent;
  let fixture: ComponentFixture<LeadAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
