/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HighScoresComponent } from './high-scores.component';
import { FormsModule } from '@angular/forms';
import { AppSettingsService } from '../Services/app-settings.service';
import { ElectronService } from 'ngx-electron';

describe('HighScoresComponent', () => {
  let component: HighScoresComponent;
  let fixture: ComponentFixture<HighScoresComponent>;
  let service: AppSettingsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HighScoresComponent
      ],
      imports: [
        FormsModule
     ],
     providers: [
      ElectronService,
      AppSettingsService
    ],
    })
    .compileComponents();
    service = TestBed.get(AppSettingsService);
    service.appSettings = {
      token: 'Invalid',
      version: '1.0.0.0',
      highScores: [
        {
          date: new Date(Date.now()),
          name: 'Test 1',
          highScore: 100
        },
        {
          date: new Date(Date.now()),
          name: 'Test 2',
          highScore: 90
        },
        {
          date: new Date(Date.now()),
          name: 'Test 3',
          highScore: 80
        },
        {
          date: new Date(Date.now()),
          name: 'Test 4',
          highScore: 70
        },
        {
          date: new Date(Date.now()),
          name: 'Test 5',
          highScore: 60
        },
        {
          date: new Date(Date.now()),
          name: 'Test 6',
          highScore: 50
        },
        {
          date: new Date(Date.now()),
          name: 'Test 7',
          highScore: 40
        },
        {
          date: new Date(Date.now()),
          name: 'Test 8',
          highScore: 30
        },
        {
          date: new Date(Date.now()),
          name: 'Test 9',
          highScore: 20
        },
        {
          date: new Date(Date.now()),
          name: 'Test 10',
          highScore: 10
        }
      ]
    };
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HighScoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    if (fixture.nativeElement && 'remove' in fixture.nativeElement) {
      (fixture.nativeElement as HTMLElement).remove();
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('initialiseTable() should set top and bottom arrays correctly', () => {
    // Arrange
    component.score = 52;
    // Act
    component.initialiseTable();
    // Assert
    expect(component.topHighScores.length).toEqual(5);
    expect(component.bottomHighScores.length).toEqual(5);
    expect(component.newHighScoreIndex).toEqual(5);
  });

  it('initialiseTable() should set newHighScoreIndex to 0 if only 1 high score', () => {
    // Arrange
    service.appSettings.highScores = [];
    component.score = 0;
    // Act
    component.initialiseTable();
    // Assert
    expect(component.newHighScoreIndex).toEqual(0);
  });

  it('isHighScore() should check if score is in top ten', () => {
    // Arrange
    component.score = 9;
    // Assert & Act
    expect(component.isHighScore()).toBeFalsy();
    // Arrange
    component.score = 10;
    // Assert & Act
    expect(component.isHighScore()).toBeFalsy();
    // Arrange
    component.score = 11;
    // Assert & Act
    expect(component.isHighScore()).toBeTruthy();
  });
});
