/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { QuestionService } from './question.service';
import { HttpClientModule } from '@angular/common/http';

describe('Service: Question', () => {

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        QuestionService
      ],
      imports: [
        HttpClientModule
     ]
    });
  });

  it('should ...', inject([QuestionService], (service: QuestionService) => {
    expect(service).toBeTruthy();
  }));
});
