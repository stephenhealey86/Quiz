/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AppCommsService } from './app-comms.service';

describe('Service: AppComms', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppCommsService]
    });
  });

  it('should ...', inject([AppCommsService], (service: AppCommsService) => {
    expect(service).toBeTruthy();
  }));
});
