import { Component, OnInit, OnDestroy } from '@angular/core';
import { QuestionService } from '../services/question.service';
import { AppSettingsService } from '../Services/app-settings.service';
import { throwError } from 'rxjs';
import { QuizApiQuestion } from '../models/quiz-api-question';
import { QuizViewQuestion } from '../models/quiz-view-question';
import { QuizViewAnswer } from '../models/quiz-view-answer';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  backgroundTile = [];
  started = false;
  questions: Array<QuizApiQuestion> = [];
  score = 0;
  time = 0;
  highScore: number;
  timerId: any;
  gameLengthInSeconds = 60;
  timesUp = false;
  newHighScore = false;
  buttonsAreLocked = false;
  informationMessage: string = null;
  currentQuestion: QuizViewQuestion = null;
  private currentQuestionIndex = 0;
  private get token(): string {
    return this.settingsService.appSettings.token;
  }

  constructor(private settingsService: AppSettingsService, private questionService: QuestionService) { }

  ngOnInit() {
    this.initaliseBackground();
    this.settingsService.getAppSettings();
    this.getToken();
    this.highScore = this.isNullOrUndefined(this.settingsService.appSettings.highScore) ? 0 : this.settingsService.appSettings.highScore;
  }

  getFormattedTime(): string {
    if (this.time === 0) {
      return '00';
    } else if (this.time <= 9) {
      return `0${this.time}`;
    } else {
      return this.time.toString();
    }
  }

  isNullOrUndefined(value: any): boolean {
    if (value !== null && value !== undefined) {
      return false;
    }
    return true;
  }

  initaliseBackground(): void {
    for (let i = 0; i < 3000; i++) {
      this.backgroundTile.push(0);
    }
  }

  private getToken(): void {
    if (this.settingsService.appSettings.token) {
      this.renewToken(this.settingsService.appSettings.token);
    } else {
      this.getNewToken();
    }
  }

  private renewToken(token: string): void {
    this.questionService.resetSessionToken(token)
      .subscribe(res => {
        if (res.response_code === 0) {
          this.settingsService.appSettings.token = res.token;
          this.getQuestions();
          return;
        }
        this.getNewToken();
      }, err => {
        console.log('Renew Token Error');
        console.log(err);
        this.getNewToken();
      });
  }

  private getNewToken(): void {
    this.questionService.getSessionToken()
      .subscribe(res => {
        if (res.response_code === 0) {
          this.settingsService.appSettings.token = res.token;
          this.getQuestions();
          return;
        }
        throwError('Invalid');
      }, err => {
        console.log('New Token Error');
        console.log(err);
        setTimeout(() => {
          this.informationMessage = 'Problem with internet. Re-trying';
          this.getNewToken();
        }, 5000);
      });
  }

  private async getQuestions(): Promise<void> {
    if (this.token) {
      await this.questionService.getQuestions(this.token)
        .subscribe(res => {
          if (res.response_code === 0) {
            this.questions = res.results;
            this.currentQuestionIndex = 0;
            this.currentQuestion = this.calculateQuestion();
            return;
          }
          console.log(res.response_code);
        }, err => {
          console.log('Get Questions Error');
          console.log(err);
          setTimeout(() => {
          this.informationMessage = 'Problem with internet. Re-trying';
          this.getQuestions();
        }, 5000);
        });
    }
  }

  getCurrentQuestion(): void {
    if (this.questions.length > 0 && this.currentQuestionIndex < this.questions.length) {
      this.currentQuestion = this.calculateQuestion();
    } else {
      this.currentQuestion = null;
      this.getQuestions();
    }
  }

  calculateQuestion(): QuizViewQuestion {
    const QUESTION = this.questions[this.currentQuestionIndex];
    const QUESTION_VIEW = {} as QuizViewQuestion;
    const ANSWERS = this.calculateAnswers(QUESTION);
    QUESTION_VIEW.category = QUESTION.category;
    QUESTION_VIEW.difficulty = QUESTION.difficulty;
    QUESTION_VIEW.question = QUESTION.question;
    QUESTION_VIEW.answerA = ANSWERS[0];
    QUESTION_VIEW.answerB = ANSWERS[1];
    QUESTION_VIEW.answerC = ANSWERS[2];
    QUESTION_VIEW.answerD = ANSWERS[3];
    return QUESTION_VIEW;
  }

  calculateAnswers(question: QuizApiQuestion): Array<QuizViewAnswer> {
    const ARR = [
      {
        answer: question.correct_answer,
        correct: true
      },
      {
        answer: question.incorrect_answers[0],
        correct: false
      },
      {
        answer: question.incorrect_answers[1],
        correct: false
      },
      {
        answer: question.incorrect_answers[2],
        correct: false
      },
    ] as Array<QuizViewAnswer>;
    shuffle(ARR);
    return ARR;

    function shuffle(array: Array<QuizViewAnswer>) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }
  }

  submitAnswer(event: MouseEvent, correct: boolean): void {
    if (!this.buttonsAreLocked) {
      this.buttonsAreLocked = true;
      const ELEMENT = event.target as HTMLElement;
      const BTN = ELEMENT.closest('button');
      BTN.blur();
      if (correct) {
        this.calculateScore();
        BTN.classList.remove('btn-primary');
        BTN.classList.add('btn-success');
        BTN.setAttribute('disabled', 'true');
        setTimeout(() => {
          this.currentQuestionIndex++;
          this.getCurrentQuestion();
          this.resetButtons();
          this.buttonsAreLocked = false;
        }, 1000);
      } else {
        setTimeout(() => {
          this.buttonsAreLocked = false;
          this.toggleLockedButtons();
        }, 2000);
        BTN.classList.remove('btn-primary');
        BTN.classList.add('btn-danger');
        BTN.setAttribute('disabled', 'true');
        this.toggleLockedButtons();
      }
    } else {
      this.wobbleButtons();
    }
  }

  resetButtons(): void {
    const ELEMENTS = document.getElementsByClassName('btn');
    if (ELEMENTS) {
      const ARR = [].slice.call(ELEMENTS) as Array<HTMLButtonElement>;
      ARR.forEach(btn => {
        btn.classList.remove('btn-danger');
        btn.classList.remove('btn-success');
        btn.classList.add('btn-primary');
        btn.removeAttribute('disabled');
      });
    }
  }

  toggleLockedButtons(): void {
    if (!this.buttonsAreLocked) {
      const ELEMENTS = document.getElementsByClassName('btn-locked');
      const ARR = [].slice.call(ELEMENTS) as Array<HTMLButtonElement>;
      ARR.forEach(btn => {
        btn.classList.remove('btn-locked');
      });
    } else {
      const ELEMENTS = document.getElementsByClassName('btn-primary');
      const ARR = [].slice.call(ELEMENTS) as Array<HTMLButtonElement>;
      ARR.forEach(btn => {
        btn.classList.add('btn-locked');
      });
    }
  }

  wobbleButtons(): void {
    const ELEMENTS = document.getElementsByClassName('btn');
    if (ELEMENTS) {
      const ARR = [].slice.call(ELEMENTS) as Array<HTMLButtonElement>;
      ARR.forEach(btn => {
        btn.animate([
          // keyframes
          { transform: 'translateX(-2px)' },
          { transform: 'translateX(2px)' }
        ], {
          // timing options
          duration: 50,
          iterations: 10
        });
      });
    }
  }

  calculateScore(): void {
    this.score += 10;
    console.log(this.score);
  }

  start(): void {
    this.getCurrentQuestion();
    this.score = 0;
    this.started = true;
    this.timesUp = false;
    this.newHighScore = false;
    this.timerId = setInterval(() => {
      this.gameTimer();
    }, 1000);
  }

  gameTimer(): void {
    if (this.time < this.gameLengthInSeconds) {
      this.time++;
      return;
    }
    clearInterval(this.timerId);
    this.currentQuestionIndex++;
    this.timesUp = true;
    this.time = 0;
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this.settingsService.appSettings.highScore = this.score;
      this.settingsService.saveAppSettings();
      this.newHighScore = true;
    }
  }

}
