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

@NgModule({
   declarations: [
      AppComponent,
      TitleBarComponent,
      HomeComponent
   ],
   imports: [
      BrowserModule,
      HttpClientModule,
      AppRoutingModule
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
