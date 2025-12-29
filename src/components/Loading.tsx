import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
      <div className="relative">
        <div className="absolute inset-0 bg-indigo-200 rounded-full blur-xl animate-pulse opacity-50"></div>
        <div className="relative bg-white p-4 rounded-full shadow-lg">
           <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      </div>
      <p className="text-gray-500 font-medium animate-pulse">Finding the perfect spots...</p>
    </div>
  );
};