import type { CountdownSettings } from './index';

export interface SavedCountdown {
  id: string;
  name: string;
  settings: CountdownSettings;
  createdAt: string;
  updatedAt: string;
}

export interface CountdownCollection {
  countdowns: SavedCountdown[];
  activeCountdownId: string | null;
}
