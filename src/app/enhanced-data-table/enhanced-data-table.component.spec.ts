import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnhancedDataTableComponent } from './enhanced-data-table.component';

describe('EnhancedDataTableComponent', () => {
  let component: EnhancedDataTableComponent;
  let fixture: ComponentFixture<EnhancedDataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnhancedDataTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnhancedDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should upsert', () => {
    expect(component).toBeTruthy();
  });
});
