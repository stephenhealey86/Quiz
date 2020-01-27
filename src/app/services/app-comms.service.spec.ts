/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AppCommsService } from './app-comms.service';

let service: AppCommsService;

describe('Service: AppComms', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppCommsService]
    });
  });

  beforeEach(inject([AppCommsService], (appService: AppCommsService) => {
    service = appService;
  }));

  it('should ...', () => {
    expect(service).toBeTruthy();
  });

  it('all flags should be false', () => {
    expect(service.flags.gameStarted).toBeFalsy();
    expect(service.flags.titleBarStopBtnPressed).toBeFalsy();
    expect(Object.keys(service.flags).length).toEqual(2);
  })

  it('AddEventListner() should add callback', () => {
    // Arrange
    let value = false;
    service.AddEventListner((e) => {
      value = !value;
      expect(e.detail.titleBarStopBtnPressed).toBeFalsy();
      expect(e.detail.gameStarted).toBeFalsy();
    });
    // Act
    service.UpdateState();
    // Assert
    expect(value).toBeTruthy();
    // Act
    service.UpdateState();
    // Assert
    expect(value).toBeFalsy();
  });
});
