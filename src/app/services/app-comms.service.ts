import { Injectable } from '@angular/core';
import { AppCommsModel } from '../models/app-comms-model';

@Injectable({
  providedIn: 'root'
})
export class AppCommsService {

  flags = {} as AppCommsModel;
  private stateChanged = new CustomEvent('stateChanged', { detail: this.flags});

constructor() {
  this.flags.titleBarStopBtnPressed = false;
  this.flags.gameStarted = false;
}

  UpdateState(): void {
    document.dispatchEvent(this.stateChanged);
  }

  AddEventListner(callback: any): void {
    document.addEventListener('stateChanged', callback);
  }

}
