import { useState, useEffect } from 'react';

// TypeScript interfaces for AI-enhanced activities
interface AIActivity {
  id: string;
  title: string;
  description: string;
  ai_enhanced_description: string;
  activity_type: string;
  duration: string;
  duration_minutes: number;
  cost_category: string;
  price_min?: number;
  price_max?: number;
  venue_name: string;
  address: string;
  city: string;
  rating: number;
  is_open_now: boolean;
  
  // AI Magic Fields (the new stuff!)
  joy_factors: string[];
  parent_whisper: string;
  surprise_element: string;
  mood_tags: string[];
  spontaneity_score: number;
  source: string;
}

function App() {
  // Your original state
  const [currentScreen, setCurrentScreen] = useState<string>('main');
  const [selectedLocation, setSelectedLocation] = useState<string>('San Francisco');
  const [selectedDuration, setSelectedDuration] = useState<string>('2 hrs');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [activities, setActivities] = useState<AIActivity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // New AI features
  const [moodQuery, setMoodQuery] = useState<string>('');

  // ⚠️ IMPORTANT: Replace this with YOUR actual Render backend URL
const API_BASE_URL = 'https://family-activity-api.onrender.com/api';

  // Your original data
  const filterOptions: string[] = [
    'OUTDOOR', 'INDOOR', 'FREE', 'LOW ENERGY', 'HIGH ENERGY', 
    'UNDER $25', '$25+', 'HAPPENING NOW', 'HIGHLY RATED'
  ];

  const cityOptions: string[] = ['Berkeley', 'San Francisco', 'Oakland', 'San Jose', 'Palo Alto'];
  
  interface DurationOption {
    value: string;
    label: string;
    description: string;
  }

  const durationOptions: DurationOption[] = [
    { value: '30 min', label: '30 min', description: 'Perfect for a quick visit' },
    { value: '1 hr', label: '1 hr', description: 'Great for focused activities' },
    { value: '2 hrs', label: '2 hrs', description: 'Explore at a comfortable pace' },
    { value: '4+ hrs', label: '4+ hrs', description: 'Plenty of time to enjoy' },
    { value: 'All day', label: 'All day', description: 'Make it a full adventure' }
  ];

  // Load favorites (using state instead of localStorage per instructions)
  useEffect(() => {
    setFavorites(['sample_1', 'sample_2']);
  }, []);

  // Enhanced search function
  const handleSearch = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      let endpoint = '/activities';
      let method = 'GET';
      let url = `${API_BASE_URL}${endpoint}`;
      
      // If mood query is provided, use mood search
      if (moodQuery.trim()) {
        endpoint = '/activities/mood-search';
        method = 'POST';
        url = `${API_BASE_URL}${endpoint}`;
      }
      
      let response: Response;
      
      if (method === 'POST') {
        // Mood-based search
        response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: moodQuery,
            location: selectedLocation
          })
        });
      } else {
        // Regular search with your original parameters
        const params = new URLSearchParams();
        params.append('location', selectedLocation);
        params.append('duration', selectedDuration);
        params.append('mood_hint', moodQuery); // Add mood hint to regular search
        
        selectedFilters.forEach(filter => {
          params.append('filters[]', filter);
        });

        response = await fetch(`${url}?${params}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setActivities(data.activities || []);
        setCurrentScreen('results');
      } else {
        setError(data.error || 'Failed to fetch activities');
      }
    } catch (err) {
      console.error('Search failed:', err);
      setError('Unable to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Your original functions
  const toggleFavorite = (activityId: string): void => {
    setFavorites(prev => 
      prev.includes(activityId)
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    );
  };

  const toggleFilter = (filter: string): void => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const formatPrice = (activity: AIActivity): string => {
    if (activity.cost_category === 'free') return 'Free';
    if (activity.price_min === activity.price_max) return `$${activity.price_min}`;
    if (activity.price_min && activity.price_max) return `$${activity.price_min}-${activity.price_max}`;
    return activity.cost_category;
  };

  // Enhanced Activity Card with AI Magic
  const AIActivityCard = ({ activity }: { activity: AIActivity }) => {
    const isFavorite = favorites.includes(activity.id);
    const [showFullTip, setShowFullTip] = useState<boolean>(false);
    
    return (
      <div className="bg-yellow-400 p-6 rounded-3xl mb-4 relative">
        {/* AI Confidence Badge */}
        <div className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
          🤖 {Math.round((activity.spontaneity_score || 0.8) * 100)}% Perfect
        </div>
        
        {/* Favorite button */}
        <button 
          onClick={() => toggleFavorite(activity.id)}
          className="absolute top-3 right-3 text-2xl hover:scale-110 transition-transform"
        >
          {isFavorite ? '⭐' : '☆'}
        </button>

        <div className="mt-8">
          <h3 className="font-bold text-black text-xl mb-3 pr-8">{activity.title}</h3>
          
          {/* AI Enhanced Description */}
          <p className="text-black text-sm mb-4 leading-relaxed bg-white bg-opacity-20 p-3 rounded-lg">
            {activity.ai_enhanced_description || activity.description}
          </p>
          
          {/* Joy Factors (the magic!) */}
          {activity.joy_factors && activity.joy_factors.length > 0 && (
            <div className="mb-4">
              <div className="text-black text-xs font-semibold mb-2">✨ What makes this magical:</div>
              {activity.joy_factors.map((joy: string, idx: number) => (
                <div key={idx} className="text-black text-xs bg-white bg-opacity-30 p-2 rounded mb-1">
                  • {joy}
                </div>
              ))}
            </div>
          )}
          
          {/* Parent Whisper (insider tip) */}
          {activity.parent_whisper && (
            <div className="mb-4">
              <button 
                onClick={() => setShowFullTip(!showFullTip)}
                className="w-full bg-purple-500 bg-opacity-30 p-3 rounded-lg text-left"
              >
                <div className="text-black text-xs font-semibold mb-1">🤫 Parent Whisper:</div>
                <div className="text-black text-xs italic">
                  {showFullTip ? activity.parent_whisper : 
                   `${activity.parent_whisper.substring(0, 60)}${activity.parent_whisper.length > 60 ? '...' : ''}`}
                </div>
                {activity.parent_whisper.length > 60 && (
                  <div className="text-yellow-800 text-xs mt-1">
                    {showFullTip ? 'Show less' : 'Tap for full tip'}
                  </div>
                )}
              </button>
            </div>
          )}
          
          {/* Surprise Element */}
          {activity.surprise_element && (
            <div className="mb-4 bg-pink-500 bg-opacity-30 p-3 rounded-lg">
              <div className="text-black text-xs font-semibold mb-1">🎉 Hidden Surprise:</div>
              <div className="text-black text-xs">{activity.surprise_element}</div>
            </div>
          )}

          {/* Duration and Price */}
          <div className="flex items-center gap-4 mb-3">
            <span className="text-black text-sm">⏱️ {activity.duration}</span>
            <span className="text-black text-sm font-medium">{formatPrice(activity)}</span>
          </div>

          {/* Venue and Status */}
          <div className="mb-3">
            <div className="text-black text-sm">📍 {activity.venue_name}</div>
            {activity.address && (
              <div className="text-black text-xs opacity-75">{activity.address}</div>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-sm">
                    {i < Math.floor(activity.rating) ? '⭐' : '☆'}
                  </span>
                ))}
              </div>
              <span className="text-black text-sm">({activity.rating})</span>
            </div>
            
            {activity.is_open_now && (
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Open Now
              </span>
            )}
          </div>

          {/* Mood Tags */}
          {activity.mood_tags && activity.mood_tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {activity.mood_tags.slice(0, 3).map((tag: string, idx: number) => (
                <span key={idx} className="text-xs bg-black bg-opacity-10 text-black px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Location Selection Screen (Your Original)
  if (currentScreen === 'location') {
    return (
      <div className="min-h-screen bg-white p-6 max-w-sm mx-auto">
        <div className="flex items-center mb-8">
          <button onClick={() => setCurrentScreen('main')} className="text-2xl mr-4">←</button>
          <h2 className="text-2xl font-bold">Select Location</h2>
        </div>
        
        <div className="space-y-4">
          {cityOptions.map((city: string) => (
            <button
              key={city}
              onClick={() => {
                setSelectedLocation(city);
                setCurrentScreen('main');
              }}
              className={`w-full p-5 rounded-2xl border-2 text-left font-medium transition-all ${
                selectedLocation === city
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg">{city}</span>
                {selectedLocation === city && <span className="text-blue-500">✓</span>}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Duration Selection Screen (Your Original)
  if (currentScreen === 'duration') {
    return (
      <div className="min-h-screen bg-white p-6 max-w-sm mx-auto">
        <div className="flex items-center mb-8">
          <button onClick={() => setCurrentScreen('main')} className="text-2xl mr-4">←</button>
          <h2 className="text-2xl font-bold">How long do you have?</h2>
        </div>
        
        <div className="space-y-4">
          {durationOptions.map((option: DurationOption) => (
            <button
              key={option.value}
              onClick={() => {
                setSelectedDuration(option.value);
                setCurrentScreen('main');
              }}
              className={`w-full p-5 rounded-2xl border-2 text-left font-medium transition-all ${
                selectedDuration === option.value
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg">{option.label}</div>
                  <div className="text-sm text-gray-500">{option.description}</div>
                </div>
                {selectedDuration === option.value && <span className="text-red-500">✓</span>}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Results Screen (Enhanced)
  if (currentScreen === 'results') {
    return (
      <div className="min-h-screen bg-white p-6 max-w-sm mx-auto">
        {/* Header with selections */}
        <div className="flex gap-3 mb-6">
          <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
            📍 {selectedLocation}
          </div>
          <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium">
            🕐 {selectedDuration}
          </div>
        </div>

        {/* AI Query Display */}
        {moodQuery && (
          <div className="bg-purple-100 p-4 rounded-2xl mb-6">
            <div className="text-purple-800 font-semibold text-sm">🤖 You said:</div>
            <div className="text-purple-700 text-sm mt-1">"{moodQuery}"</div>
          </div>
        )}

        {/* Active Filters */}
        {selectedFilters.length > 0 && (
          <div className="flex gap-2 mb-6 flex-wrap">
            {selectedFilters.map((filter: string) => (
              <span key={filter} className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-medium">
                {filter}
              </span>
            ))}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <div className="text-gray-600 text-lg">🤖 AI is finding magical activities...</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="font-bold">Connection Error</div>
            <div className="text-sm">{error}</div>
          </div>
        )}

        {/* Activity Results */}
        {activities.length > 0 ? (
          <div>
            <div className="text-lg font-bold mb-4">✨ Found {activities.length} magical activities</div>
            {activities.map((activity: AIActivity) => (
              <AIActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        ) : !loading && (
          <div className="text-center py-12">
            <div className="text-gray-600 text-lg">No activities found</div>
            <div className="text-sm text-gray-500 mt-2">Try adjusting your filters or mood.</div>
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={() => {
            setCurrentScreen('main');
            setMoodQuery('');
          }}
          className="w-full bg-black text-white py-4 rounded-full mt-6 font-bold text-lg"
        >
          New Search
        </button>
      </div>
    );
  }

  // Main Screen (Your Original + AI Enhancement)
  return (
    <div className="min-h-screen bg-white p-6 max-w-sm mx-auto">
      {/* Header - Exact Figma Match */}
      <div className="flex justify-between items-center mb-8">
        <div className="text-3xl font-bold text-black">TOT TROT</div>
        <div className="flex gap-4">
          <button className="text-2xl">📍</button>
          <button className="text-2xl">☰</button>
        </div>
      </div>

      {/* Benny Name Display - Exact Figma Match */}
      <div className="mb-6">
        <div className="bg-green-500 text-white px-8 py-4 rounded-full text-center">
          <span className="text-xl font-bold">Benny</span>
        </div>
      </div>

      {/* Location Selector - Exact Figma Match */}
      <div className="mb-4">
        <div className="bg-blue-500 text-white px-8 py-4 rounded-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg">📍</span>
            <span className="text-lg font-semibold">{selectedLocation}</span>
          </div>
          <button 
            className="text-sm bg-blue-400 px-4 py-2 rounded-full hover:bg-blue-300 transition-colors font-medium"
            onClick={() => setCurrentScreen('location')}
          >
            CHANGE
          </button>
        </div>
      </div>

      {/* Duration Selector - Exact Figma Match */}
      <div className="mb-8">
        <div className="bg-red-500 text-white px-8 py-4 rounded-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg">🕐</span>
            <span className="text-lg font-semibold">{selectedDuration}</span>
          </div>
          <button 
            className="text-sm bg-red-400 px-4 py-2 rounded-full hover:bg-red-300 transition-colors font-medium"
            onClick={() => setCurrentScreen('duration')}
          >
            CHANGE
          </button>
        </div>
      </div>

      {/* Filter Section with Mood Search - Combined as requested */}
      <div className="bg-yellow-400 p-6 rounded-3xl mb-8">
        <div className="text-black font-bold text-2xl mb-6">Find something</div>
        
        {/* Mood Search Field - Added inside the filter card */}
        <div className="mb-6">
          <input
            type="text"
            value={moodQuery}
            onChange={(e) => setMoodQuery(e.target.value)}
            placeholder="What's the mood? (Kids are antsy and need energy...)"
            className="w-full p-3 rounded-lg border-0 bg-white text-gray-800 placeholder-gray-500"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          {moodQuery && (
            <button
              onClick={() => setMoodQuery('')}
              className="mt-2 text-black text-xs hover:text-gray-600"
            >
              Clear & use filters instead
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-3 mb-6">
          {filterOptions.map((filter: string) => (
            <button
              key={filter}
              onClick={() => toggleFilter(filter)}
              className={`px-5 py-3 rounded-full text-sm font-bold border-2 border-black transition-all ${
                selectedFilters.includes(filter)
                  ? 'bg-black text-yellow-400'
                  : 'bg-transparent text-black hover:bg-black hover:text-yellow-400'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Show selected filters count */}
        {selectedFilters.length > 0 && (
          <div className="text-center mb-4">
            <span className="text-black text-sm font-medium">
              {selectedFilters.length} filter{selectedFilters.length > 1 ? 's' : ''} selected
            </span>
          </div>
        )}
      </div>

      {/* Go Button - Exact Figma Match (Single button as requested) */}
      <button
        onClick={handleSearch}
        disabled={loading}
        className={`w-full py-5 rounded-full text-2xl font-bold transition-all ${
          loading 
            ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
            : 'bg-black text-white hover:bg-gray-800 active:bg-gray-900'
        }`}
      >
        {loading ? 'Searching...' : 'Go'}
      </button>

      {/* Quick Actions - Your Original */}
      <div className="mt-8 grid grid-cols-2 gap-4">
        <button 
          onClick={() => {
            setSelectedFilters(['HAPPENING NOW']);
            handleSearch();
          }}
          className="bg-green-500 text-white py-4 rounded-2xl text-sm font-bold hover:bg-green-600 transition-colors"
        >
          🔴 Live Events
        </button>
        <button 
          onClick={() => {
            setSelectedFilters(['FREE']);
            handleSearch();
          }}
          className="bg-blue-500 text-white py-4 rounded-2xl text-sm font-bold hover:bg-blue-600 transition-colors"
        >
          💰 Free Activities
        </button>
      </div>

      {/* Status */}
      <div className="mt-8 text-center">
        <div className="text-xs text-gray-400">
          🤖 AI-powered recommendations • {cityOptions.length} cities • {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}

export default App;
