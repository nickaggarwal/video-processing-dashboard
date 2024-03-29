import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResendVerificationEmailComponent } from './resend-verification-email.component';

describe('ResendVerificationEmailComponent', () => {
  let component: ResendVerificationEmailComponent;
  let fixture: ComponentFixture<ResendVerificationEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResendVerificationEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResendVerificationEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should upsert', () => {
    expect(component).toBeTruthy();
  });
});
