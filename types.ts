
export enum GameStage {
  START = 'START',
  MORNING = 'MORNING', // Glass Collision
  NOON = 'NOON',    // Light Pollution
  NIGHT = 'NIGHT',   // Aerial Net
  SUMMARY = 'SUMMARY'
}

export interface GameState {
  stage: GameStage;
  budget: number;
  satisfaction: number;
  birdSaved: number;
  birdDeaths: number;
  isBirdView: boolean;
  unlockedBirds: string[];
  isSolved: boolean; // Tracks if current level is fixed
}

export interface Bird {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  rarity: 'Common' | 'Rare' | 'Endangered';
  image: string;
}

export interface Choice {
  id: string;
  title: string;
  description: string;
  cost: number;
  satisfactionChange: number;
  successRate: number;
  isCorrect: boolean;
  feedback: string;
}

export interface LevelData {
  id: GameStage;
  name: string;
  problem: string;
  scenario: string;
  choices: Choice[];
}
