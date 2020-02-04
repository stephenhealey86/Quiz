import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HighScoreModel } from '../models/high-score-model';
import { AppSettingsService } from '../Services/app-settings.service';

@Component({
  selector: 'app-high-scores',
  templateUrl: './high-scores.component.html',
  styleUrls: ['./high-scores.component.css']
})
export class HighScoresComponent implements OnInit {

  @Input() score: number;

  private get highScores(): Array<HighScoreModel> {
    return this.settingsService.appSettings.highScores.sort((a, b) => (a.highScore > b.highScore) ? -1 : 1);
  }

  newHighScore = {} as HighScoreModel;
  topHighScores = [] as Array<HighScoreModel>;
  bottomHighScores = [] as Array<HighScoreModel>;
  newHighScoreIndex: number;


  constructor(private settingsService: AppSettingsService) { }

  ngOnInit() {
    this.initialiseTable();
  }

  initialiseTable(): void {
    this.newHighScore.highScore = this.score;
    this.newHighScore.date = new Date(Date.now());
    if (this.isHighScore()) {
      this.newHighScoreIndex = this.highScores.length;
      for (let i = 0; i < this.highScores.length; i++) {
        if (this.score > this.highScores[i].highScore) {
          this.newHighScoreIndex = i;
          break;
        }
      }
      this.topHighScores = this.highScores.slice(0, this.newHighScoreIndex);
      const END_OF_ARRAY = this.highScores.length > 9 ? this.highScores.length - 1 : this.highScores.length;
      this.bottomHighScores = this.highScores.slice(this.newHighScoreIndex, END_OF_ARRAY);
    } else {
      this.topHighScores = this.highScores;
      this.bottomHighScores = [];
      this.newHighScoreIndex = this.topHighScores.length;
    }
  }

  saveHighScore(): void {
    if (this.isHighScore()) {
      const HIGH_SCORES = this.settingsService.appSettings.highScores;
      HIGH_SCORES.push(this.newHighScore);
      HIGH_SCORES.sort((a, b) => (a.highScore > b.highScore) ? -1 : 1);
      for (let i = 0; i < HIGH_SCORES.length; i++) {
        if (i > 9) {
          HIGH_SCORES.pop();
        }
      }
      this.settingsService.saveAppSettings();
      this.score = 0;
      this.topHighScores = this.highScores;
      this.bottomHighScores = [];
      this.newHighScoreIndex = this.topHighScores.length;
    }
  }

  isHighScore(): boolean {
    if (this.score > 0) {
      if (this.highScores.length > 9) {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.highScores.length; i++) {
          if (this.score > this.highScores[i].highScore) {
            return true;
          }
        }
        return false;
      }
      return true;
    }
    return false;
  }

}
