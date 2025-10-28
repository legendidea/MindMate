
import React, { useState, useCallback, useEffect } from 'react';
import { analyzeMood } from './services/geminiService';
import { searchPlaylists } from './services/spotifyService';
import { MoodAnalysis, MoodEntry, SpotifyPlaylist } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useSpotifyAuth } from './hooks/useSpotifyAuth';
import Header from './components/Header';
import MoodInput from './components/MoodInput';
import MoodCard from './components/MoodCard';
import MoodJournal from './components/MoodJournal';
import MoodAnalytics from './components/MoodAnalytics';
import { BrainCircuit } from './components/icons';

const App: React.FC = () => {
  const [currentMood, setCurrentMood] = useState<MoodAnalysis | null>(null);
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [journal, setJournal] = useLocalStorage<MoodEntry[]>('moodJournal', []);
  const { accessToken, login, logout } = useSpotifyAuth();
  const [spotifyPlaylist, setSpotifyPlaylist] = useState<SpotifyPlaylist | null>(null);

  const handleAnalyze = useCallback(async (text: string) => {
    if (!text.trim()) {
      setError("Please enter how you're feeling.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setCurrentMood(null);
    setSpotifyPlaylist(null);
    setUserInput(text);

    try {
      const analysis = await analyzeMood(text);
      setCurrentMood(analysis);
    } catch (err) {
      setError('Sorry, I had trouble understanding that. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchPlaylist = async () => {
      if (accessToken && currentMood?.moodMatchContent?.type === 'music') {
        try {
          const playlist = await searchPlaylists(currentMood.moodMatchContent.query, accessToken);
          setSpotifyPlaylist(playlist);
        } catch (e) {
          console.error("Failed to fetch playlist from Spotify", e);
        }
      }
    };
    fetchPlaylist();
  }, [currentMood, accessToken]);

  const handleSaveToJournal = useCallback(() => {
    if (currentMood && userInput) {
      const newEntry: MoodEntry = {
        id: Date.now(),
        date: new Date().toISOString(),
        userInput: userInput,
        analysis: currentMood,
      };
      setJournal([newEntry, ...journal]);
      setCurrentMood(null); 
      setSpotifyPlaylist(null);
      setUserInput('');
    }
  }, [currentMood, userInput, journal, setJournal]);

  const handleResetJournal = useCallback(() => {
    setJournal([]);
  }, [setJournal]);

  return (
    <div className="min-h-screen bg-slate-50 text-brand-text">
      <Header 
        isSpotifyConnected={!!accessToken}
        onSpotifyConnect={login}
        onSpotifyDisconnect={logout}
      />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          <div className="bg-white p-6 rounded-2xl shadow-lg space-y-6">
            <h2 className="text-2xl font-bold text-brand-text">How are you feeling today?</h2>
            <MoodInput onAnalyze={handleAnalyze} isLoading={isLoading} />
            {error && <p className="text-red-500 text-center">{error}</p>}
            
            {isLoading && (
              <div className="flex flex-col items-center justify-center p-8 text-brand-subtle">
                <BrainCircuit className="w-16 h-16 animate-pulse text-brand-primary" />
                <p className="mt-4 text-lg">MindMate is thinking...</p>
              </div>
            )}

            {currentMood && (
              <MoodCard 
                moodAnalysis={currentMood}
                onSave={handleSaveToJournal}
                isSpotifyConnected={!!accessToken}
                spotifyPlaylist={spotifyPlaylist}
              />
            )}
          </div>

          <div className="space-y-8">
            <MoodAnalytics journal={journal} />
            <MoodJournal journal={journal} onReset={handleResetJournal} />
          </div>

        </div>
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm">
        <p>MindMate &copy; {new Date().getFullYear()}. Your privacy is respected. All data is stored locally on your device.</p>
      </footer>
    </div>
  );
};

export default App;