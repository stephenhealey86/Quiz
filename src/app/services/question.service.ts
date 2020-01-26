import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { QuizApiTokenResponse } from '../models/quiz-api-token-response';
import { environment } from 'src/environments/environment';
import { QuizApiModel } from '../models/quiz-api-model';
import { QuizApiTriviaCategories } from '../models/quiz-api-trivia-categories';
import { QuizApiCategory } from '../models/quiz-api-category';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

private tokenUrl = environment.quizApiTokenUrl;
private questionUrl = environment.quizApiQuestionsUrl;
private caegoryUrl = environment.quizApiCategoryUrl;

constructor(private http: HttpClient) { }

getSessionToken(): Observable<QuizApiTokenResponse> {
  return this.http.get<QuizApiTokenResponse>(this.tokenUrl + 'request');
}

resetSessionToken(token: string): Observable<QuizApiTokenResponse> {
  return this.http.get<QuizApiTokenResponse>(this.tokenUrl + `reset&token=${token}`);
}

getQuestions(token: string, category?: QuizApiCategory): Observable<QuizApiModel> {
  if (category === undefined || category === null) {
    return this.http.get<QuizApiModel>(this.questionUrl + `&token=${token}`);
  }
  return this.http.get<QuizApiModel>(this.questionUrl + `&token=${token}` + `&category=${category.id}`);
}

getCategories(): Observable<QuizApiTriviaCategories> {
  return this.http.get<QuizApiTriviaCategories>(this.caegoryUrl);
}

}
