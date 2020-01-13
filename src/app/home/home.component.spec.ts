/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HomeComponent } from './home.component';
import { QuestionService } from '../services/question.service';
import { AppSettingsService } from '../Services/app-settings.service';
import { ElectronService } from 'ngx-electron';
import { HttpClientModule } from '@angular/common/http';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HomeComponent
      ],
      providers: [
        ElectronService,
        AppSettingsService,
        QuestionService,
      ],
      imports: [
        HttpClientModule
     ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
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
});
