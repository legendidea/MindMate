
import React from 'react';
import { MoodEntry } from '../types';
import JournalEntry from './JournalEntry';
import { TrashIcon } from './icons';

interface MoodJournalProps {
  journal: MoodEntry[];
  onReset: () => void;
}

const MoodJournal: React.FC<MoodJournalProps> = ({ journal, onReset }) => {
  const handleResetClick = () => {
    if (window.confirm('Are you sure you want to delete all journal entries? This action cannot be undone.')) {
      onReset();
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-brand-text">My Mood Journal</h2>
        {journal.length > 0 && (
          <button
            onClick={handleResetClick}
            className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 font-semibold transition-colors disabled:opacity-50"
            title="Reset Journal"
          >
            <TrashIcon className="w-4 h-4" />
            Reset
          </button>
        )}
      </div>
      {journal.length > 0 ? (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {journal.map((entry) => (
            <JournalEntry key={entry.id} entry={entry} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 px-4 border-2 border-dashed border-gray-200 rounded-lg">
            <p className="text-brand-subtle">Your saved mood entries will appear here.</p>
            <p className="text-sm text-gray-400 mt-1">Start by analyzing your mood!</p>
        </div>
      )}
    </div>
  );
};

export default MoodJournal;