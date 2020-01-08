import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { QuizApiTokenResponse } from '../models/quiz-api-token-response';
import { environment } from 'src/environments/environment';
import { QuizApiModel } from '../models/quiz-api-model';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

private tokenUrl = environment.quizApiTokenUrl;
private questionUrl = environment.quizApiQuestionsUrl;

constructor(private http: HttpClient) { }

getSessionToken(): Observable<QuizApiTokenResponse> {
  return this.http.get<QuizApiTokenResponse>(this.tokenUrl + 'request');
}

resetSessionToken(token: string): Observable<QuizApiTokenResponse> {
  return this.http.get<QuizApiTokenResponse>(this.tokenUrl + `reset&token=${token}`);
}

getQuestions(token: string): Observable<QuizApiModel> {
  return this.http.get<QuizApiModel>(this.questionUrl + `&token=${token}`);
}

}
