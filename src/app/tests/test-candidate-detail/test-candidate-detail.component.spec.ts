import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCandidateDetailComponent } from './test-candidate-detail.component';

describe('TestCandidateDetailComponent', () => {
  let component: TestCandidateDetailComponent;
  let fixture: ComponentFixture<TestCandidateDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestCandidateDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestCandidateDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
