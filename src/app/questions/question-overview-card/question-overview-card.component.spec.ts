import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionOverviewCardComponent } from './question-overview-card.component';

describe('QuestionOverviewCardComponent', () => {
  let component: QuestionOverviewCardComponent;
  let fixture: ComponentFixture<QuestionOverviewCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionOverviewCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionOverviewCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should upsert', () => {
    expect(component).toBeTruthy();
  });
});
