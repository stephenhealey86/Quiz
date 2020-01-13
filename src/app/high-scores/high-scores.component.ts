import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HighScoreModel } from '../models/high-score-model';

@Component({
  selector: 'app-high-scores',
  templateUrl: './high-scores.component.html',
  styleUrls: ['./high-scores.component.css']
})
export class HighScoresComponent implements OnInit {

  @Input() highScores: Array<HighScoreModel>;
  private newHighScoreValue: HighScoreModel;
  @Input() set newHighScore(value: HighScoreModel) {
    if (value !== undefined && value !== null) {
      this.newHighScoreValue = value;
      for (let i = 0; i < this.highScores.length; i++) {
        if (value.highScore > this.highScores[i].highScore) {
          this.newHighScoreIndex = i;
          break;
        }
      }
      this.topHighScores = this.highScores.slice(0, this.newHighScoreIndex);
      this.bottomHighScores = this.highScores.slice(this.newHighScoreIndex, this.highScores.length);
      if (this.highScores.length >= 10) {
        this.bottomHighScores.pop();
      }
    } else {
      this.topHighScores = this.highScores;
    }
  }
  get newHighScore(): HighScoreModel {
    return this.newHighScoreValue;
  }
  @Output() saveScore = new EventEmitter();

  topHighScores: Array<HighScoreModel>;
  bottomHighScores: Array<HighScoreModel>;
  newHighScoreIndex = 1;


  constructor() { }

  ngOnInit() {
  }

  saveHighScore(): void {
    this.newHighScoreIndex = null;
    this.saveScore.emit(true);
  }

}
