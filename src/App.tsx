import { useState, useEffect } from 'react';

interface Activity {
  id: string;
  title: string;
  description: string;
  activity_type: string;
  duration: string;
  duration_minutes: number;
  cost_category: string;
  venue_name: string;
  address: string;
  city: string;
  rating: number;
  review_count?: number;
  is_open_now: boolean;
  source: string;
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<string>('main');
  const [selectedLocation, setSelectedLocation] = useState<string>('San Francisco');
  const [selectedDuration, setSelectedDuration] = useState<string>('2 hrs');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [moodQuery, setMoodQuery] = useState<string>('');

  // Your actual Render backend URL
  const API_BASE_URL = 'https://family-activity-api.onrender.com/api';

  const filterOptions: string[] = [
    'OUTDOOR', 'INDOOR', 'FREE', 'LOW ENERGY', 'HIGH ENERGY', 
    'UNDER $25', '$25+', 'HAPPENING NOW', 'HIGHLY RATED'
  ];

  const cityOptions: string[] = ['Berkeley', 'San Francisco', 'Oakland', 'San Jose', 'Palo Alto'];
  
  const durationOptions = [
    { value: '30 min', label: '30 min', description: 'Perfect for a quick visit' },
    { value: '1 hr', label: '1 hr', description: 'Great for focused activities' },
    { value: '2 hrs', label: '2 hrs', description: 'Explore at a comfortable pace' },
    { value: '4+ hrs', label: '4+ hrs', description: 'Plenty of time to enjoy' },
    { value: 'All day', label: 'All day', description: 'Make it a full adventure' }
  ];

  useEffect(() => {
    setFavorites(['sample_1', 'sample_2']);
  }, []);

  const handleSearch = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      let endpoint = '/activities';
      let method = 'GET';
      let url = `${API_BASE_URL}${endpoint}`;
      
      if (moodQuery.trim()) {
        endpoint = '/activities/mood-search';
        method = 'POST';
        url = `${API_BASE_URL}${endpoint}`;
      }
      
      let response: Response;
      
      if (method === 'POST') {
        response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: moodQuery,
            location: selectedLocation
          })
        });
      } else {
        const params = new URLSearchParams();
        params.append('location', selectedLocation);
        params.append('duration', selectedDuration);
        params.append('mood_hint', moodQuery);
        
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
        setError(data.error || data.message || 'Failed to fetch activities');
      }
    } catch (err) {
      console.error('Search failed:', err);
      setError('Unable to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

  const formatPrice = (activity: Activity): string => {
    if (activity.cost_category === 'free') return 'Free';
    return activity.cost_category;
  };

  // Simple Activity Card for Real Data
  const ActivityCard = ({ activity }: { activity: Activity }) => {
    const isFavorite = favorites.includes(activity.id);
    
    return (
      <div className="bg-yellow-400 p-6 rounded-3xl mb-4 relative">
        <button 
          onClick={() => toggleFavorite(activity.id)}
          className="absolute top-3 right-3 text-2xl"
        >
          {isFavorite ? '⭐' : '☆'}
        </button>

        <div className="mt-2">
          <h3 className="font-bold text-black text-xl mb-3 pr-8">{activity.title}</h3>
          <p className="text-black text-sm mb-4">{activity.description}</p>
          
          <div className="flex items-center gap-4 mb-3">
            <span className="text-black text-sm">⏱️ {activity.duration}</span>
            <span className="text-black text-sm font-medium">{formatPrice(activity)}</span>
          </div>

          <div className="mb-3">
            <div className="text-black text-sm">📍 {activity.venue_name}</div>
            <div className="text-black text-xs opacity-75">{activity.address}</div>
          </div>

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
              {activity.review_count && activity.review_count > 0 && (
                <span className="text-black text-xs">• {activity.review_count} reviews</span>
              )}
            </div>
            
            {activity.is_open_now && (
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Open Now
              </span>
            )}
          </div>

          <div className="mt-2 text-xs text-black opacity-60">
            Source: {activity.source}
          </div>
        </div>
      </div>
    );
  };

  // Location Selection Screen
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

  // Duration Selection Screen
  if (currentScreen === 'duration') {
    return (
      <div className="min-h-screen bg-white p-6 max-w-sm mx-auto">
        <div className="flex items-center mb-8">
          <button onClick={() => setCurrentScreen('main')} className="text-2xl mr-4">←</button>
          <h2 className="text-2xl font-bold">How long do you have?</h2>
        </div>
        
        <div className="space-y-4">
          {durationOptions.map((option) => (
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

  // Results Screen
  if (currentScreen === 'results') {
    return (
      <div className="min-h-screen bg-white p-6 max-w-sm mx-auto">
        <div className="flex gap-3 mb-6">
          <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
            📍 {selectedLocation}
          </div>
          <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium">
            🕐 {selectedDuration}
          </div>
        </div>

        {moodQuery && (
          <div className="bg-purple-100 p-4 rounded-2xl mb-6">
            <div className="text-purple-800 font-semibold text-sm">🔍 You searched:</div>
            <div className="text-purple-700 text-sm mt-1">"{moodQuery}"</div>
          </div>
        )}

        {selectedFilters.length > 0 && (
          <div className="flex gap-2 mb-6 flex-wrap">
            {selectedFilters.map((filter: string) => (
              <span key={filter} className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-medium">
                {filter}
              </span>
            ))}
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <div className="text-gray-600 text-lg">Finding real activities...</div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="font-bold">Error</div>
            <div className="text-sm">{error}</div>
          </div>
        )}

        {activities.length > 0 ? (
          <div>
            <div className="text-lg font-bold mb-4">Found {activities.length} real activities</div>
            {activities.map((activity: Activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        ) : !loading && (
          <div className="text-center py-12">
            <div className="text-gray-600 text-lg">No activities found</div>
            <div className="text-sm text-gray-500 mt-2">
              {!error && "Add Google Places API key to get real activity data"}
            </div>
          </div>
        )}

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

  // Main Screen
  return (
    <div className="min-h-screen bg-white p-6 max-w-sm mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="text-3xl font-bold text-black">TOT TROT</div>
        <div className="flex gap-4">
          <button className="text-2xl">📍</button>
          <button className="text-2xl">☰</button>
        </div>
      </div>

      <div className="mb-6">
        <div className="bg-green-500 text-white px-8 py-4 rounded-full text-center">
          <span className="text-xl font-bold">Benny</span>
        </div>
      </div>

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

      <div className="mb-8">
        <div className="bg-red-500 text-white px-8 py-4 rounded-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg">🕐</span>
            <span className="text-lg font-semibold">{selectedDuration}</span>
          </div>
          <button 
            className="text-sm bg-red-400 px-4 py-2

      onClick={() => setCurrentScreen('duration')}
         >
           CHANGE
         </button>
       </div>
     </div>

     <div className="bg-yellow-400 p-6 rounded-3xl mb-8">
       <div className="text-black font-bold text-2xl mb-6">Find something</div>
       
       <div className="mb-6">
         <input
           type="text"
           value={moodQuery}
           onChange={(e) => setMoodQuery(e.target.value)}
           placeholder="What are you looking for? (parks, museums, playgrounds...)"
           className="w-full p-3 rounded-lg border-0 bg-white text-gray-800 placeholder-gray-500"
           onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
         />
         {moodQuery && (
           <button
             onClick={() => setMoodQuery('')}
             className="mt-2 text-black text-xs hover:text-gray-600"
           >
             Clear search
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

       {selectedFilters.length > 0 && (
         <div className="text-center mb-4">
           <span className="text-black text-sm font-medium">
             {selectedFilters.length} filter{selectedFilters.length > 1 ? 's' : ''} selected
           </span>
         </div>
       )}
     </div>

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

     <div className="mt-8 text-center">
       <div className="text-xs text-gray-400">
         Real activity data • {cityOptions.length} cities • {new Date().toLocaleDateString()}
       </div>
     </div>
   </div>
 );
}

export default App;
