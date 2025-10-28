
export interface MoodMatchContent {
  type: 'music' | 'quote' | 'activity';
  content: string;
  source?: string;
  query?: string; // For Spotify search
}

export interface MoodAnalysis {
  mood: string;
  happinessScore: number;
  reason: string;
  message: string;
  suggestion: string;
  moodMatchContent: MoodMatchContent;
}

export interface MoodEntry {
  id: number;
  date: string;
  userInput: string;
  analysis: MoodAnalysis;
}

export interface SpotifyPlaylist {
  name: string;
  description: string | null;
  external_urls: {
    spotify: string;
  };
  images: {
    url: string;
  }[];
  tracks: {
    items: {
      track: {
        name: string;
        artists: { name: string }[];
      };
    }[];
  };
}