import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { TitleBarComponent } from './title-bar/title-bar.component';
import { ElectronService } from 'ngx-electron';
import { HighScoresComponent } from './high-scores/high-scores.component';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        TooltipModule.forRoot()
      ],
      declarations: [
        AppComponent,
        TitleBarComponent,
        HomeComponent,
        HighScoresComponent
      ],
      providers: [
        ElectronService
      ]
    }).compileComponents();
  }));

  afterEach(() => {
    const fixture = TestBed.createComponent(AppComponent);
    if (fixture.nativeElement && 'remove' in fixture.nativeElement) {
      (fixture.nativeElement as HTMLElement).remove();
    }
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Quiz'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Quiz');
  });
});
