import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ElectronService } from 'ngx-electron';
import * as settings from 'electron-settings';
import { AppSettingsModel } from '../models/app-settings-model';
import { version } from 'package.json';

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
  if (this.appIsNewVersion()) {
    if (this.appSettings.highScore) {
      const HIGH_SCORE = this.appSettings.highScore;
      this.clearAppSettings();
      this.seedSettings(HIGH_SCORE);
    } else {
      this.clearAppSettings();
      this.seedSettings();
    }
    this.saveAppSettings();
  }
}

// Returns true if running in production, Electron is assumed to be true when in production
isRunningInElectron(): boolean {
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

private seedSettings(highScore?: number): AppSettingsModel {
  console.log('Seeding Settings');
  return {
    version: this.isRunningInElectron() ? this.electronService.remote.app.getVersion() : version,
    token: null,
    highScore: highScore ? highScore : 0
  };
}

private getWebAppSettings(): AppSettingsModel {
  const SETTINGS  = JSON.parse(localStorage.getItem(this.SETTINGS)) as AppSettingsModel;
  if (SETTINGS !== null && SETTINGS !== undefined) {
    return SETTINGS;
  }
  return this.seedSettings();
}

private appIsNewVersion(): boolean {
  if (this.isRunningInElectron()) {
    if (this.appSettings.version === null || this.appSettings.version === undefined) {
      this.appSettings.version = this.electronService.remote.app.getVersion();
      return true;
    } else if (this.compareVersion(this.appSettings.version, this.electronService.remote.app.getVersion()) === -1) {
      this.appSettings.version = this.electronService.remote.app.getVersion();
      return true;
    }
    return false;
  } else {
    if (this.appSettings.version === null || this.appSettings.version === undefined) {
      this.appSettings.version = version;
      return true;
    } else if (this.compareVersion(this.appSettings.version, version) === -1) {
      this.appSettings.version = version;
      return true;
    }
    return false;
  }
}

private compareVersion(v1: any, v2: any): any {
  if (typeof v1 !== 'string') { return false; }
  if (typeof v2 !== 'string') { return false; }
  v1 = v1.split('.');
  v2 = v2.split('.');
  const k = Math.min(v1.length, v2.length);
  for (let i = 0; i < k; ++ i) {
      v1[i] = parseInt(v1[i], 10);
      v2[i] = parseInt(v2[i], 10);
      if (v1[i] > v2[i]) { return 1; }
      if (v1[i] < v2[i]) { return -1; }
  }
  return v1.length === v2.length ? 0 : (v1.length < v2.length ? -1 : 1);
}

saveAppSettings(): void {
  console.log('Saving Settings');
  if (this.isRunningInElectron()) {
    this.settings.set(this.SETTINGS, JSON.stringify(this.appSettings));
  } else {
    localStorage.setItem(this.SETTINGS, JSON.stringify(this.appSettings));
  }
}

private clearAppSettings(): void {
  console.log('Cleared Settings');
  if (this.isRunningInElectron()) {
    this.settings.delete(this.SETTINGS);
  } else {
    localStorage.removeItem(this.SETTINGS);
  }
}

}
