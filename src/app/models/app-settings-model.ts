import { HighScoreModel } from './high-score-model';

export interface AppSettingsModel {
    version: string;
    token: string;
    highScores: Array<HighScoreModel>;
}
