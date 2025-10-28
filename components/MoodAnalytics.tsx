
import React from 'react';
import { MoodEntry } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface MoodAnalyticsProps {
  journal: MoodEntry[];
}

const MoodAnalytics: React.FC<MoodAnalyticsProps> = ({ journal }) => {
  const processData = (entries: MoodEntry[]) => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentEntries = entries
      .filter(entry => new Date(entry.date) >= sevenDaysAgo)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return recentEntries.map(entry => ({
      date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      happiness: entry.analysis.happinessScore,
    }));
  };

  const data = processData(journal);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-brand-text mb-4">Weekly Mood Trend</h2>
      {data.length > 1 ? (
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis domain={[1, 10]} allowDecimals={false} stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: '0.5rem',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="happiness" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center py-8 px-4 border-2 border-dashed border-gray-200 rounded-lg h-64 flex items-center justify-center">
            <p className="text-brand-subtle">Not enough data for a chart. <br/> Keep journaling to see your mood trend!</p>
        </div>
      )}
    </div>
  );
};

export default MoodAnalytics;
