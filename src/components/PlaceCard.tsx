import React from 'react';
import { MapPin, Navigation, Star } from 'lucide-react';
import { PlaceCardProps } from '../types';

export const PlaceCard: React.FC<PlaceCardProps> = ({ place, index }) => {
  const mapData = place.maps;

  if (!mapData) return null;

  return (
    <div className="group relative bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full">
      <div className="absolute top-3 right-3 z-10">
        <span className="flex items-center justify-center w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-sm text-sm font-bold text-indigo-600">
          {index + 1}
        </span>
      </div>
      
      {/* Placeholder Image since Grounding doesn't always return a photo reference directly usable without Places SDK */}
      <div className="h-32 w-full bg-gradient-to-r from-indigo-50 to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pattern-dots" />
        <div className="absolute inset-0 flex items-center justify-center text-indigo-200">
             <MapPin size={48} />
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">
          {mapData.title}
        </h3>
        
        {/* We infer rating/type from the text response usually, but here we just show the action */}
        
        <div className="mt-auto pt-4 flex items-center justify-between">
            <a 
                href={mapData.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
            >
                <Navigation size={16} />
                <span>Get Directions</span>
            </a>
            
            {/* If we had explicit rating data in the chunk, we'd show it here. 
                Often Maps Grounding puts it in the text, so we rely on the summary text in the main view. 
                However, we can add a visual indicator. */}
             <div className="flex text-yellow-400">
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
             </div>
        </div>
      </div>
    </div>
  );
};