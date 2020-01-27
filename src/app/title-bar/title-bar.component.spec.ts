/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TitleBarComponent } from './title-bar.component';
import { AppSettingsService } from 'src/app/Services/app-settings.service';
import { ElectronService } from 'ngx-electron';

describe('TitleBarComponent', () => {
  let component: TitleBarComponent;
  let fixture: ComponentFixture<TitleBarComponent>;
  let de: DebugElement;
  let spy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TitleBarComponent
      ],
      providers: [
        AppSettingsService,
        ElectronService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TitleBarComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
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

  it('title should be quiz', () => {
    expect(component.title).toEqual('Quiz');
    expect(de.query(By.css('#title')).nativeElement.innerText).toEqual('Quiz');
  });

  it('restart button should be invisible at start up', () => {
    // Arrange
    const BTN = de.query(By.css('#restartButton'));
    // Act & Assert
    expect(BTN.nativeElement.classList.contains('invisible')).toBeTruthy();
  });

  it('restart button should be visible after game started', () => {
    // Arrange
    component.commsService.flags.gameStarted = true;
    fixture.detectChanges();
    const BTN = de.query(By.css('#restartButton'));
    // Act & Assert
    expect(BTN.nativeElement.classList.contains('invisible')).toBeFalsy();
  });

  it('minimize window button should be present', () => {
    // Arrange
    const BTN = de.query(By.css('#minWindowBtn'));
    // Act & Assert
    expect(BTN).toBeTruthy();
  });

  it('maximize window button should be present', () => {
    // Arrange
    const BTN = de.query(By.css('#maxWindowBtn'));
    // Act & Assert
    expect(BTN).toBeTruthy();
  });

  it('close window button should be present', () => {
    // Arrange
    const BTN = de.query(By.css('#closeWindowBtn'));
    // Act & Assert
    expect(BTN).toBeTruthy();
  });

  it('minimize window button should call minWindow()', () => {
    // Arrange
    const BTN = de.query(By.css('#minWindowBtn'));
    spy = spyOn(component, 'minWindow');
    // Assert
    expect(spy).toHaveBeenCalledTimes(0);
    // Act
    BTN.nativeElement.click();
    // Re-Assert
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('maximize window button should call maxWindow', () => {
    // Arrange
    const BTN = de.query(By.css('#maxWindowBtn'));
    spy = spyOn(component, 'maxWindow');
    // Assert
    expect(spy).toHaveBeenCalledTimes(0);
    // Act
    BTN.nativeElement.click();
    // Re-Assert
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('close window button should call closeWindow', () => {
    // Arrange
    const BTN = de.query(By.css('#closeWindowBtn'));
    spy = spyOn(component, 'closeWindow');
    // Assert
    expect(spy).toHaveBeenCalledTimes(0);
    // Act
    BTN.nativeElement.click();
    // Re-Assert
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
