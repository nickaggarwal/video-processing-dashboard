import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterpriseTypeComponent } from './enterprise-type.component';

describe('EnterpriseTypeComponent', () => {
  let component: EnterpriseTypeComponent;
  let fixture: ComponentFixture<EnterpriseTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterpriseTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterpriseTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
