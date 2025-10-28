
import React from 'react';
import { MoodEntry } from '../types';

interface JournalEntryProps {
  entry: MoodEntry;
}

const JournalEntry: React.FC<JournalEntryProps> = ({ entry }) => {
  const { date, userInput, analysis } = entry;
  
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedTime = new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  
  const getMoodColor = (score: number) => {
      if (score > 7) return 'border-green-400';
      if (score > 4) return 'border-yellow-400';
      return 'border-blue-400';
  };

  return (
    <div className={`p-4 bg-slate-50 border-l-4 ${getMoodColor(analysis.happinessScore)} rounded-lg`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold text-brand-text">{analysis.mood}</p>
          <p className="text-sm text-brand-subtle italic">"{userInput}"</p>
        </div>
        <div className="text-right text-xs text-brand-subtle flex-shrink-0 ml-2">
          <p>{formattedDate}</p>
          <p>{formattedTime}</p>
        </div>
      </div>
    </div>
  );
};

export default JournalEntry;
