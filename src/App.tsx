import React, { useState, useEffect } from 'react';
import { MapPin, AlertCircle, Sparkles, Download, X, Share } from 'lucide-react';
import { Coordinates, RecommendationResponse, FilterState, SortOption } from './types';
import { getPlaceRecommendations } from './services/geminiService';
import { MoodSelector } from './components/MoodSelector';
import { PlaceCard } from './components/PlaceCard';
import { Loading } from './components/Loading';
import { FilterBar } from './components/FilterBar';

const App: React.FC = () => {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [filters, setFilters] = useState<FilterState>({
    openNow: false,
    topRated: false,
    priceLevel: 'any'
  });
  const [sortBy, setSortBy] = useState<SortOption>('relevance');

  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // PWA State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [showInstallBanner, setShowInstallBanner] = useState<boolean>(true);

  useEffect(() => {
    // PWA Install Prompt Listener
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });

    // Check if running in standalone mode (installed)
    const checkStandalone = () => {
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
                              (window.navigator as any).standalone || 
                              document.referrer.includes('android-app://');
      setIsStandalone(!!isStandaloneMode);
      if (isStandaloneMode) setShowInstallBanner(false);
    };
    
    checkStandalone();
    window.matchMedia('(display-mode: standalone)').addEventListener('change', checkStandalone);

    // Request location on mount
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationError(null);
        },
        (err) => {
          console.error(err);
          setLocationError("We need your location to find places near you.");
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
    }

    return () => {
      window.matchMedia('(display-mode: standalone)').removeEventListener('change', checkStandalone);
    }
  }, []);

  // Trigger search when Filters or Sort changes, if a mood is already selected
  useEffect(() => {
    if (selectedMood && !isLoading) {
      handleSearch(selectedMood);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sortBy]);

  const handleSearch = async (mood: string) => {
    if (!location) {
      setLocationError("Please enable location services to proceed.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getPlaceRecommendations(mood, location, filters, sortBy);
      setRecommendations(data);
    } catch (err) {
      setError("Something went wrong while finding places. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    handleSearch(mood);
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallBanner(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
                <Sparkles className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              MoodMap
            </h1>
          </div>
          <div className="flex items-center gap-3">
             {deferredPrompt && (
                <button
                  onClick={handleInstall}
                  className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-indigo-100 transition-colors border border-indigo-100"
                >
                  <Download size={14} />
                  <span className="hidden sm:inline">Install App</span>
                  <span className="sm:hidden">Install</span>
                </button>
             )}
             <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                <MapPin size={14} />
                {location ? 
                  <span className="text-green-600 font-medium">Active</span> : 
                  <span className="text-red-500">{locationError ? "Error" : "..."}</span>
                }
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        
        {/* Install Banner (Visible if not installed) */}
        {!isStandalone && showInstallBanner && (
          <div className="bg-indigo-600 rounded-xl p-4 mb-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Download size={120} />
             </div>
             
             <div className="flex-1 relative z-10">
                <h3 className="font-bold text-lg mb-1">Install MoodMap</h3>
                <p className="text-indigo-100 text-sm max-w-lg">
                  {deferredPrompt 
                    ? "Add this app to your home screen for instant access and a better fullscreen experience."
                    : "To install: Tap your browser's Share or Menu button, then select 'Add to Home Screen' or 'Install App'."}
                </p>
             </div>

             <div className="flex items-center gap-3 relative z-10 w-full sm:w-auto">
                {deferredPrompt ? (
                  <button 
                    onClick={handleInstall}
                    className="flex-1 sm:flex-none bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Download size={16} />
                    Install Now
                  </button>
                ) : (
                  <div className="hidden sm:flex items-center gap-2 text-indigo-200 text-sm italic">
                    <Share size={14} />
                    Use browser menu to install
                  </div>
                )}
                <button 
                  onClick={() => setShowInstallBanner(false)}
                  className="p-2 hover:bg-indigo-500 rounded-lg transition-colors text-indigo-200 hover:text-white"
                >
                  <X size={20} />
                </button>
             </div>
          </div>
        )}
        
        {/* Intro */}
        <div className="text-center mb-8 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
            Find the perfect spot for your <span className="text-indigo-600">current vibe</span>.
          </h2>
          <p className="text-lg text-gray-500">
            Tell us how you're feeling, apply filters, and we'll find the best matches.
          </p>
        </div>

        {/* Location Error Banner */}
        {locationError && (
          <div className="mb-8 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-700 max-w-2xl mx-auto">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{locationError}</p>
          </div>
        )}

        {/* Mood Selection */}
        <div className="mb-8">
            <MoodSelector 
              selectedMood={selectedMood} 
              onSelectMood={handleMoodSelect} 
              isLoading={isLoading} 
            />
        </div>

        {/* Filters & Sort */}
        <div className="mb-10 max-w-4xl mx-auto">
           <FilterBar 
             filters={filters} 
             setFilters={setFilters} 
             sortBy={sortBy} 
             setSortBy={setSortBy} 
             disabled={isLoading}
           />
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-10 text-red-600 bg-red-50 rounded-2xl mb-10">
            <p>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && <Loading />}

        {/* Results */}
        {!isLoading && recommendations && (
          <div className="animate-fade-in-up">
            
            {/* AI Summary */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm mb-10 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600"></div>
              <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                <Sparkles size={16} />
                AI Recommendation Summary
              </h3>
              <div className="prose prose-indigo max-w-none text-gray-700 leading-relaxed">
                <p className="whitespace-pre-line">{recommendations.text}</p>
              </div>
            </div>

            {/* Places Grid */}
            {recommendations.places.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <MapPin className="text-gray-400" />
                  Identified Locations
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.places.map((place, idx) => (
                    <PlaceCard key={idx} place={place} index={idx} />
                  ))}
                </div>
              </div>
            )}

            {recommendations.places.length === 0 && (
              <div className="text-center text-gray-500 py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                AI provided a summary, but couldn't pinpoint specific map coordinates for this request. Try adjusting your mood or filters.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;