import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ElectronService } from 'ngx-electron';
import * as settings from 'electron-settings';
import { AppSettingsModel } from '../models/app-settings-model';

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {

  //#region Variables
  private settings: typeof settings;
  public appSettings: AppSettingsModel;
  private SETTINGS = 'quizSettingsApp';

  //#endregion

constructor(private electronService: ElectronService) {
  if (this.isRunningInElectron()) {
    this.settings = this.electronService.remote.require('electron-settings');
  }
}

getAppSettings(): void {
  if (this.isRunningInElectron()) {
    this.appSettings = this.getElectronSettings();
  } else {
    this.appSettings = this.getWebAppSettings();
  }
}

// Returns true if running in production, Electron is assumed to be true when in production
private isRunningInElectron(): boolean {
  return environment.production;
}

private getElectronSettings(): AppSettingsModel {
  // Get notes from storage
  if (this.settings.has(this.SETTINGS)) {
    const SETTINGS = JSON.parse(this.settings.get(this.SETTINGS)) as AppSettingsModel;
    return SETTINGS;
  }
  return this.seedSettings();
}

private seedSettings(): AppSettingsModel {
  return {
    token: null,
    highScore: 0
  };
}

private getWebAppSettings(): AppSettingsModel {
  const SETTINGS  = JSON.parse(localStorage.getItem(this.SETTINGS)) as AppSettingsModel;
  if (SETTINGS !== null && SETTINGS !== undefined) {
    return SETTINGS;
  }
  return this.seedSettings();
}

saveAppSettings(): void {
  if (this.isRunningInElectron()) {
    // Store electron notes
    this.settings.set(this.SETTINGS, JSON.stringify(this.appSettings));
  } else { // Store webapp notes
    localStorage.setItem(this.SETTINGS, JSON.stringify(this.appSettings));
  }
}

}
