import { TestBed } from '@angular/core/testing';

import { EnterpriseTypeService } from './enterprise-type.service';

describe('EnterpriseTypeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EnterpriseTypeService = TestBed.get(EnterpriseTypeService);
    expect(service).toBeTruthy();
  });
});
