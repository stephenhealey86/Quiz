import { HighScoreModel } from './high-score-model';
import { QuizApiCategory } from './quiz-api-category';

export interface AppSettingsModel {
    version: string;
    token: string;
    highScores: Array<HighScoreModel>;
}
