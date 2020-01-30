/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, tick, fakeAsync, inject, discardPeriodicTasks } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HomeComponent } from './home.component';
import { QuestionService } from '../services/question.service';
import { AppSettingsService } from '../Services/app-settings.service';
import { ElectronService } from 'ngx-electron';
import { HttpClientModule } from '@angular/common/http';
import { HighScoresComponent } from '../high-scores/high-scores.component';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AppCommsService } from '../services/app-comms.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let de: DebugElement;
  let commsService: AppCommsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HomeComponent,
        HighScoresComponent
      ],
      providers: [
        ElectronService,
        AppSettingsService,
        QuestionService,
      ],
      imports: [
        HttpClientModule,
        FormsModule,
        TooltipModule.forRoot()
     ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  beforeEach(inject([AppCommsService], (service: AppCommsService) => {
    commsService = service;
  }));

  afterEach(() => {
    if (fixture.nativeElement && 'remove' in fixture.nativeElement) {
      (fixture.nativeElement as HTMLElement).remove();
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getFormattedTime() should return the remaining seconds as two charater string', () => {
    // Arrange
    component.time = 0;
    // Act & Assert
    expect(component.getFormattedTime()).toEqual('00');
    // Arrange
    component.time = 9;
    // Act & Assert
    expect(component.getFormattedTime()).toEqual('09');
    // Arrange
    component.time = 10;
    // Act & Assert
    expect(component.getFormattedTime()).toEqual('10');
    // Arrange
    component.time = null;
    // Act & Assert
    expect(component.getFormattedTime()).toEqual('00');
  });

  it('start() should start game and set variables', fakeAsync(() => {
    // Arrange
    component.informationMessage = 'Test';
    component.time = 0;
    component.score = 10;
    component.started = false;
    component.timesUp = true;
    // Act
    component.start();
    tick(20000);
    // Assert
    expect(component.informationMessage).toBeNull();
    expect(component.time).toEqual(40);
    expect(component.score).toEqual(0);
    expect(component.started).toBeTruthy();
    expect(component.timesUp).toBeFalsy();
    discardPeriodicTasks();
  }));

  it('restart() should reinitialise variables', fakeAsync(() => {
    // Arrange
    component.start();
    // Act
    tick(2000);
    // Assert
    expect(commsService.flags.gameStarted).toBeTruthy();
    expect(component.timesUp).toBeFalsy();
    expect(component.time).toEqual(58);
    // Act
    component.restart();
    // Assert
    expect(commsService.flags.gameStarted).toBeFalsy();
    expect(component.timesUp).toBeTruthy();
    expect(component.time).toEqual(0);
  }));

  it('loading screen should be active', () => {
    // Arrange & Act
    component.start();
    // Assert
    expect(component.timesUp).toBeFalsy();
    expect(component.currentQuestion).toBeNull();
    expect(de.query(By.css('.fa-spinner'))).toBeTruthy();
  });

  it('loading screen should not be active', () => {
    // Arrange & Act
    component.restart();
    fixture.detectChanges();
    // Assert
    expect(component.timesUp).toBeTruthy();
    expect(de.query(By.css('.fa-spinner'))).toBeFalsy();
  });
});
