import { QuizViewAnswer } from './quiz-view-answer';

export interface QuizViewQuestion {
    category: string;
    difficulty: string;
    question: string;
    answerA: QuizViewAnswer;
    answerB: QuizViewAnswer;
    answerC: QuizViewAnswer;
    answerD: QuizViewAnswer;
}
