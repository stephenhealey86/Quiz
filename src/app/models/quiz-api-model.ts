import { QuizApiQuestion } from './quiz-api-question';

export interface QuizApiModel {
    response_code: number;
    results: Array<QuizApiQuestion>;
}
