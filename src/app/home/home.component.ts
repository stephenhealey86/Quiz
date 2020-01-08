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

  started: boolean = false;
  questions: Array<QuizApiQuestion> = [];
  score: number = 0;
  currentQuestion: QuizViewQuestion = null;
  private currentQuestionIndex = 0;
  private get token(): string {
    return this.settingsService.appSettings.token;
  }

  constructor(private settingsService: AppSettingsService, private questionService: QuestionService) { }

  ngOnInit() {
    this.settingsService.getAppSettings();
    this.getToken();
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
        this.settingsService.appSettings.token = err;
      });
  }

  private async getQuestions(): Promise<void> {
    if (this.token) {
      await this.questionService.getQuestions(this.token)
        .subscribe(res => {
          if (res.response_code === 0) {
            this.questions = res.results;
            return;
          }
          console.log(res.response_code);
        });
    }
  }

  getCurrentQuestion(): void {
    if (this.questions.length > 0 && this.currentQuestionIndex <= this.questions.length) {
      this.currentQuestion = this.calculateQuestion();
    } else {
      this.getQuestions();
      this.currentQuestionIndex = 0;
      this.currentQuestion = this.calculateQuestion();
    }
  }

  calculateQuestion(): QuizViewQuestion{
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
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }
  }

  submitAnswer(correct: boolean): void {
    if (correct) {
      this.currentQuestionIndex++;
      this.getCurrentQuestion();
      this.score += 10;
      console.log(this.score);
    }
  }

  start(): void {
    this.getCurrentQuestion();
    this.started = true;
  }

}
