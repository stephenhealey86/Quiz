/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AppSettingsService } from './app-settings.service';
import { ElectronService } from 'ngx-electron';
import { AppSettingsModel } from '../models/app-settings-model';
import { version } from 'package.json';

describe('Service: AppSettings', () => {
  let service: AppSettingsService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AppSettingsService,
        ElectronService
      ]
    });
    service = TestBed.get(AppSettingsService);
  });

  it('AppSettingsService should be injected', () => {
    expect(service).toBeTruthy();
  });

  it('isRunningInElectron() should return false as not in Electron', () => {
    expect(service.isRunningInElectron()).toBe(false);
  });

  it('saveAppSettings() should store settings in local storage', () => {
    // Arrange
    const SETTINGS_KEY = 'quizSettingsApp';
    localStorage.removeItem(SETTINGS_KEY);
    const SETTINGS = {
      highScore: 100,
      token: 'Testing',
      version: '1.1.1'
    } as AppSettingsModel;
    service.appSettings = SETTINGS;
    // Act
    service.saveAppSettings();
    // Assert
    expect(service.appSettings).toEqual(SETTINGS);
  });

  it('getAppSettings should seed localstorage', () => {
    // Arrange
    const SETTINGS_KEY = 'quizSettingsApp';
    localStorage.removeItem(SETTINGS_KEY);
    const SETTINGS = {
      highScore: 0,
      token: null,
      version: version.toString()
    } as AppSettingsModel;
    // Act
    service.getAppSettings();
    // Assert
    expect(service.appSettings).toEqual(SETTINGS);
  });
});
