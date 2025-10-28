
import React from 'react';
import { MoodAnalysis, SpotifyPlaylist } from '../types';
import { BookOpenIcon, LightBulbIcon, MessageSquareIcon, HeartIcon, MusicIcon, QuoteIcon, SparklesIcon, SpotifyIcon } from './icons';

interface MoodCardProps {
  moodAnalysis: MoodAnalysis;
  onSave: () => void;
  isSpotifyConnected: boolean;
  spotifyPlaylist: SpotifyPlaylist | null;
}

const MoodCard: React.FC<MoodCardProps> = ({ moodAnalysis, onSave, isSpotifyConnected, spotifyPlaylist }) => {
  const { mood, reason, message, suggestion, moodMatchContent } = moodAnalysis;
  
  const getMoodColor = (mood: string) => {
      const lowerMood = mood.toLowerCase();
      if (['happy', 'joyful', 'excited', 'grateful'].some(m => lowerMood.includes(m))) return 'bg-green-100 text-green-800';
      if (['sad', 'down', 'lonely', 'depressed'].some(m => lowerMood.includes(m))) return 'bg-blue-100 text-blue-800';
      if (['anxious', 'stressed', 'worried', 'overwhelmed'].some(m => lowerMood.includes(m))) return 'bg-yellow-100 text-yellow-800';
      if (['angry', 'frustrated', 'irritated'].some(m => lowerMood.includes(m))) return 'bg-red-100 text-red-800';
      return 'bg-gray-100 text-gray-800';
  };

  const renderMoodMatchContent = () => {
    if (!moodMatchContent) return null;

    const { type, content, source } = moodMatchContent;

    let Icon, title, color;
    switch (type) {
      case 'music':
        if (!isSpotifyConnected) {
            return (
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <p className="font-semibold text-brand-text">Connect to Spotify to get a playlist!</p>
                </div>
            )
        }
        if (spotifyPlaylist) {
            return (
                 <div className="p-4 bg-slate-50 rounded-lg space-y-4">
                    <h3 className="font-semibold text-brand-text text-center">For You on Spotify</h3>
                    <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-4 sm:space-y-0 sm:space-x-4">
                        <img src={spotifyPlaylist.images[0]?.url} alt={spotifyPlaylist.name} className="w-24 h-24 rounded-md object-cover shadow-lg flex-shrink-0" />
                        <div className="flex-1">
                            <p className="font-bold text-lg text-brand-text">{spotifyPlaylist.name}</p>
                             {spotifyPlaylist.description && (
                                <p className="text-sm text-brand-subtle mt-1 line-clamp-2">
                                    {spotifyPlaylist.description}
                                </p>
                            )}
                            <a 
                                href={spotifyPlaylist.external_urls.spotify} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="mt-3 inline-flex items-center gap-2 bg-[#1DB954] text-white font-semibold py-2 px-4 rounded-full hover:bg-[#1ED760] transition duration-200 text-sm"
                            >
                                <SpotifyIcon className="w-5 h-5" />
                                Play on Spotify
                            </a>
                        </div>
                    </div>
                    {spotifyPlaylist.tracks && spotifyPlaylist.tracks.items.length > 0 && (
                        <div className="pt-4 border-t border-slate-200">
                            <h4 className="text-sm font-semibold text-brand-text mb-2">Includes tracks like:</h4>
                            <ul className="space-y-1 text-sm text-brand-subtle">
                                {spotifyPlaylist.tracks.items.slice(0, 3).map(({ track }, index) => (
                                    track && <li key={`${track.name}-${index}`} className="truncate">
                                        <span className="font-medium text-slate-600">{track.name}</span> by {track.artists.map(a => a.name).join(', ')}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )
        }
        return (
            <div className="text-center p-4 bg-slate-50 rounded-lg">
                <p className="text-brand-subtle">Searching for the perfect playlist...</p>
            </div>
        );
      case 'quote':
        Icon = QuoteIcon;
        title = 'A thought for you';
        color = 'text-purple-500';
        break;
      case 'activity':
        Icon = SparklesIcon;
        title = 'Uplifting Activity';
        color = 'text-orange-500';
        break;
      default:
        return null;
    }

    return (
      <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg">
        <Icon className={`w-6 h-6 ${color} flex-shrink-0 mt-1`} />
        <div>
          <h3 className="font-semibold text-brand-text">{title}</h3>
          <p className="text-brand-subtle italic">"{content}"</p>
          {source && <p className="text-xs text-gray-400 mt-1">- {source}</p>}
        </div>
      </div>
    );
  };

  return (
    <div className="border border-blue-100 bg-white rounded-2xl shadow-sm p-6 space-y-5 animate-fade-in">
      <div className="text-center">
        <p className="text-brand-subtle text-sm">MindMate senses you're feeling</p>
        <span className={`inline-block px-4 py-1 rounded-full text-xl font-bold mt-1 ${getMoodColor(mood)}`}>
          {mood}
        </span>
      </div>

      <div className="space-y-4 text-left">
        <div className="flex items-start space-x-3">
          <MessageSquareIcon className="w-6 h-6 text-brand-primary flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-brand-text">Reason</h3>
            <p className="text-brand-subtle">{reason}</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <HeartIcon className="w-6 h-6 text-brand-secondary flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-brand-text">A friendly note</h3>
            <p className="text-brand-subtle">{message}</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <LightBulbIcon className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-brand-text">Suggestion</h3>
            <p className="text-brand-subtle">{suggestion}</p>
          </div>
        </div>
      </div>

      {renderMoodMatchContent()}

      <button
        onClick={onSave}
        className="w-full flex items-center justify-center gap-2 bg-brand-secondary text-white font-semibold py-3 px-6 rounded-lg hover:bg-emerald-600 transition duration-200"
      >
        <BookOpenIcon className="w-5 h-5" />
        Save to Journal
      </button>
    </div>
  );
};

export default MoodCard;