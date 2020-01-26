import { Component, OnInit, Output, EventEmitter, NgZone } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { environment } from 'src/environments/environment';
import { AppSettingsService } from '../Services/app-settings.service';
import { AppCommsService } from '../services/app-comms.service';

@Component({
  selector: 'app-title-bar',
  templateUrl: './title-bar.component.html',
  styleUrls: ['./title-bar.component.css']
})
export class TitleBarComponent implements OnInit {

  //#region Variables
  // Emits windowIsMaximized
  @Output() windowState = new EventEmitter();
  // True is window is maximized
  windowIsMaximised = false;
  // Electron window
  window = {} as Electron.BrowserWindow;
  //#endregion

  constructor(private electronService: ElectronService, private settings: AppSettingsService,
              private zone: NgZone, public commsService: AppCommsService) { }

  ngOnInit() {
    if (this.isRunningInElectron()) {
      // Get electron window if running in electron
      this.window = this.electronService.remote.getCurrentWindow();
      this.window.on('maximize', this.checkMaximizeIcon.bind(this));
      this.window.on('unmaximize', this.checkMaximizeIcon.bind(this));
    }
  }

  checkMaximizeIcon(): void {
    if (this.isRunningInElectron()) {
      if (this.window.isMaximized()) {
        this.zone.run(() => {
          this.windowIsMaximised = true;
        });
      } else {
        this.zone.run(() => {
          this.windowIsMaximised = false;
        });
      }
    }
  }

  // Returns true if running in production, Electron is assumed to be true when in production
  private isRunningInElectron(): boolean {
    return environment.production;
  }

  // Emits windowIsMaximised value
  emitWindowState(): void {
    this.windowState.emit(this.windowIsMaximised);
  }

  closeWindow(): void {
    this.settings.saveAppSettings();
    if (this.isRunningInElectron()) {
      this.window.close();
    } else {
      console.log('Close window.');
    }
  }

  maxWindow(): void {
    if (this.isRunningInElectron()) {
      if (this.windowIsMaximised) {
        this.windowIsMaximised = false;
        this.emitWindowState();
        this.window.unmaximize();
        console.log('Unmaximize window.');
      } else {
        this.windowIsMaximised = true;
        this.emitWindowState();
        this.window.maximize();
        console.log('Maximize window.');
      }
    } else {
      if (this.windowIsMaximised) {
        this.windowIsMaximised = false;
        console.log('Unmaximize window.');
      } else {
        this.windowIsMaximised = true;
        console.log('Maximize window.');
      }
    }
  }

  // Minimize the window
  minWindow(): void {
    if (this.isRunningInElectron()) {
      const ELEMENT = document.activeElement as HTMLElement;
      if (ELEMENT) {
        console.log(ELEMENT);
        ELEMENT.classList.add('removeHover');
        ELEMENT.onmouseleave = () => {
          ELEMENT.classList.remove('removeHover');
        };
      }
      this.window.minimize();
    } else {
      console.log('Minimize window.');
    }
  }

  restartGame(): void {
    this.commsService.flags.titleBarStopBtnPressed = true;
    this.commsService.UpdateState();
  }
}
