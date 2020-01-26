import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { TitleBarComponent } from './title-bar/title-bar.component';
import { ElectronService } from 'ngx-electron';
import { AppSettingsService } from './Services/app-settings.service';
import { HttpClientModule } from '@angular/common/http';
import { QuestionService } from './services/question.service';
import { HighScoresComponent } from './high-scores/high-scores.component';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TooltipModule } from 'ngx-bootstrap/tooltip';


@NgModule({
   declarations: [
      AppComponent,
      TitleBarComponent,
      HomeComponent,
      HighScoresComponent
   ],
   imports: [
      BrowserModule,
      HttpClientModule,
      AppRoutingModule,
      FormsModule,
      BsDropdownModule.forRoot(),
      BrowserAnimationsModule,
      TooltipModule.forRoot()
   ],
   providers: [
      ElectronService,
      AppSettingsService,
      QuestionService
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
