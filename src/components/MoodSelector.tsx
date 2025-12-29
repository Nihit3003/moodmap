import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { MOOD_OPTIONS } from '../constants';

interface MoodSelectorProps {
  selectedMood: string;
  onSelectMood: (mood: string) => void;
  isLoading: boolean;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({ selectedMood, onSelectMood, isLoading }) => {
  const [customMood, setCustomMood] = useState('');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customMood.trim()) {
      onSelectMood(customMood);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Quick Select Chips */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {MOOD_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedMood === option.label;
          return (
            <button
              key={option.id}
              onClick={() => onSelectMood(option.label)}
              disabled={isLoading}
              className={`
                relative flex items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-200
                ${isSelected 
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg scale-105 z-10' 
                  : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-300 hover:bg-indigo-50'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              <Icon size={18} />
              <span className="font-medium text-sm">{option.label}</span>
            </button>
          );
        })}
      </div>

      {/* Custom Input */}
      <form onSubmit={handleCustomSubmit} className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500">
          <Search size={20} />
        </div>
        <input
          type="text"
          value={customMood}
          onChange={(e) => setCustomMood(e.target.value)}
          disabled={isLoading}
          placeholder="Or type anything... 'Late night tacos', 'Quiet place to study'..."
          className="block w-full pl-11 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
        />
        <button 
          type="submit"
          disabled={!customMood.trim() || isLoading}
          className="absolute right-2 top-2 bottom-2 bg-indigo-600 text-white px-4 rounded-xl font-medium text-sm disabled:opacity-0 transition-opacity"
        >
          Go
        </button>
      </form>
    </div>
  );
};