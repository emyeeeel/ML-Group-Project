import { TestBed } from '@angular/core/testing';

import { GenerateChoiceService } from './generate-choice.service';

describe('GenerateChoiceService', () => {
  let service: GenerateChoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerateChoiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
