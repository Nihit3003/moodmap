import React from 'react';
import { Clock, Star, DollarSign, ArrowUpDown } from 'lucide-react';
import { FilterState, SortOption, PriceLevel } from '../types';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  sortBy: SortOption;
  setSortBy: (option: SortOption) => void;
  disabled: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  sortBy,
  setSortBy,
  disabled
}) => {
  const toggleOpenNow = () => setFilters(prev => ({ ...prev, openNow: !prev.openNow }));
  const toggleTopRated = () => setFilters(prev => ({ ...prev, topRated: !prev.topRated }));
  
  const cyclePrice = () => {
     const levels: PriceLevel[] = ['any', 'budget', 'moderate', 'expensive'];
     const currentIndex = levels.indexOf(filters.priceLevel);
     const nextIndex = (currentIndex + 1) % levels.length;
     setFilters(prev => ({ ...prev, priceLevel: levels[nextIndex] }));
  };

  const getPriceLabel = (level: PriceLevel) => {
    switch(level) {
      case 'budget': return 'Budget ($)';
      case 'moderate': return 'Moderate ($$)';
      case 'expensive': return 'Expensive ($$$)';
      default: return 'Price: Any';
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm transition-all">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1">Filters:</span>
        <button
          onClick={toggleOpenNow}
          disabled={disabled}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            filters.openNow 
              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm' 
              : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
          } disabled:opacity-50`}
        >
          <Clock size={14} />
          Open Now
        </button>

        <button
          onClick={toggleTopRated}
          disabled={disabled}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            filters.topRated 
              ? 'bg-amber-100 text-amber-700 border border-amber-200 shadow-sm' 
              : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
          } disabled:opacity-50`}
        >
          <Star size={14} />
          Top Rated
        </button>

        <button
          onClick={cyclePrice}
          disabled={disabled}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            filters.priceLevel !== 'any'
              ? 'bg-blue-100 text-blue-700 border border-blue-200 shadow-sm' 
              : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
          } disabled:opacity-50`}
        >
          <DollarSign size={14} />
          {getPriceLabel(filters.priceLevel)}
        </button>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto pt-3 sm:pt-0 sm:border-l sm:pl-4 border-gray-200 sm:border-t-0 border-t">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Sort By:</span>
        <div className="relative w-full sm:w-auto">
            <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            disabled={disabled}
            className="w-full sm:w-auto appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block pl-3 pr-8 py-1.5 disabled:opacity-50 cursor-pointer"
            >
            <option value="relevance">Relevance</option>
            <option value="rating">Rating</option>
            <option value="distance">Distance</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <ArrowUpDown size={12} />
            </div>
        </div>
      </div>
    </div>
  );
};