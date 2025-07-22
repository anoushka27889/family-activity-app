import { useState, useEffect } from 'react';

interface Activity {
  id: number;
  title: string;
  description: string;
  duration: string;
  tags: string[];
  rating: number;
  category: string;
  cost_category: string;
  price_min?: number;
  price_max?: number;
  venue_name?: string;
  address?: string;
  city?: string;
}

// Your live API URL
const API_BASE_URL = 'https://family-activity-api.onrender.com/api';

function App() {
  const [currentScreen, setCurrentScreen] = useState('main');
  const [selectedLocation, setSelectedLocation] = useState('Berkeley');
  const [selectedDuration, setSelectedDuration] = useState('2 hrs');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filterOptions = ['OUTDOOR', 'INDOOR', 'FREE', 'LOW ENERGY', 'HIGH ENERGY', 'UNDER $20', '$20+'];

  // Fetch available locations on component mount
  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/locations`);
      const data = await response.json();
      
      if (data.success) {
        setAvailableLocations(data.locations);
        // Set first location as default if Berkeley not available
        if (data.locations.length > 0 && !data.locations.includes('Berkeley')) {
          setSelectedLocation(data.locations[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch locations:', err);
      // Fallback to default locations
      setAvailableLocations(['Berkeley', 'San Francisco', 'Oakland', 'San Jose']);
    }
  };

  const fetchActivities = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      params.append('location', selectedLocation);
      params.append('duration', selectedDuration);
      
      // Add filters
      selectedFilters.forEach(filter => {
        params.append('filters[]', filter);
      });

      const response = await fetch(`${API_BASE_URL}/activities?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setActivities(data.activities);
        setCurrentScreen('results');
      } else {
        setError(data.error || 'Failed to fetch activities');
      }
    } catch (err) {
      console.error('Failed to fetch activities:', err);
      setError('Unable to connect to server. Please try again.');
      
      // Fallback to sample data for demo
      const fallbackActivities: Activity[] = [
        {
          id: 1,
          title: "Connection Failed - Sample Activity",
          description: "This is sample data. The real data will show when the API is connected.",
          duration: "2-3 hrs",
          tags: ["sample", "demo"],
          rating: 4.0,
          category: "outdoor",
          cost_category: "free"
        }
      ];
      setActivities(fallbackActivities);
      setCurrentScreen('results');
    } finally {
      setLoading(false);
    }
  };

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const handleSearch = () => {
    fetchActivities();
  };

  const formatPrice = (activity: Activity) => {
    if (activity.cost_category === 'free') return 'Free';
    if (activity.price_min === activity.price_max) return `$${activity.price_min}`;
    if (activity.price_min && activity.price_max) return `$${activity.price_min}-${activity.price_max}`;
    return activity.cost_category;
  };

  const formatDuration = (duration: string) => {
    // Convert "120 min" to "2 hrs" for better readability
    if (duration.includes('min')) {
      const minutes = parseInt(duration);
      if (minutes >= 60) {
        const hours = Math.floor(minutes / 60);
        const remainingMins = minutes % 60;
        if (remainingMins === 0) {
          return `${hours} hr${hours > 1 ? 's' : ''}`;
        } else {
          return `${hours}h ${remainingMins}m`;
        }
      }
    }
    return duration;
  };

  if (currentScreen === 'results') {
    return (
      <div className="min-h-screen bg-white p-4 max-w-sm mx-auto">
        {/* Header */}
        <div className="flex gap-4 mb-4">
          <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm">
            📍 {selectedLocation}
          </div>
          <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm">
            🕐 {selectedDuration}
          </div>
        </div>

        {/* Active Filters */}
        {selectedFilters.length > 0 && (
          <div className="flex gap-2 mb-4 flex-wrap">
            {selectedFilters.map((filter) => (
              <span key={filter} className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-medium">
                {filter}
              </span>
            ))}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="text-gray-600">Loading activities...</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <div className="font-bold">Connection Error</div>
            <div className="text-sm">{error}</div>
          </div>
        )}

        {/* Activity Results */}
        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="bg-yellow-400 p-4 rounded-2xl">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-black text-lg">{activity.title}</h3>
                  <button className="bg-black text-yellow-400 p-2 rounded-full text-xs">
                    ⭐
                  </button>
                </div>
                
                <p className="text-black text-sm mb-3">{activity.description}</p>
                
                <div className="flex justify-between items-center mb-2">
                  <div className="text-black text-xs">{formatDuration(activity.duration)}</div>
                  <div className="text-black text-xs font-medium">{formatPrice(activity)}</div>
                </div>

                {/* Venue Info */}
                {activity.venue_name && (
                  <div className="text-black text-xs mb-2">
                    📍 {activity.venue_name}
                    {activity.city && ` • ${activity.city}`}
                  </div>
                )}
                
                {/* Tags */}
                {activity.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {activity.tags.slice(0, 4).map((tag, idx) => (
                      <span key={idx} className="text-xs text-black bg-black bg-opacity-10 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                    {activity.tags.length > 4 && (
                      <span className="text-xs text-black">+{activity.tags.length - 4} more</span>
                    )}
                  </div>
                )}
                
                <div className="flex items-center gap-1">
                  <span className="text-black text-sm">Rating:</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-xs ${i < Math.floor(activity.rating) ? '⭐' : '☆'}`}>
                        {i < Math.floor(activity.rating) ? '⭐' : '☆'}
                      </span>
                    ))}
                  </div>
                  <span className="text-black text-xs ml-1">({activity.rating})</span>
                </div>
              </div>
            ))}
          </div>
        ) : !loading && (
          <div className="text-center py-8">
            <div className="text-gray-600">No activities found for your criteria.</div>
            <div className="text-sm text-gray-500 mt-2">Try adjusting your filters or location.</div>
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={() => setCurrentScreen('main')}
          className="w-full bg-black text-white py-3 rounded-full mt-6 font-medium"
        >
          New Search
        </button>
      </div>
    );
  }

  if (currentScreen === 'location') {
    return (
      <div className="min-h-screen bg-white p-4 max-w-sm mx-auto">
        <h2 className="text-xl font-bold mb-4">Select Location</h2>
        {availableLocations.map((city) => (
          <button
            key={city}
            onClick={() => {
              setSelectedLocation(city);
              setCurrentScreen('main');
            }}
            className={`w-full p-4 mb-2 rounded-lg border-2 text-left ${
              selectedLocation === city
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200'
            }`}
          >
            {city}
          </button>
        ))}
      </div>
    );
  }

  if (currentScreen === 'duration') {
    return (
      <div className="min-h-screen bg-white p-4 max-w-sm mx-auto">
        <h2 className="text-xl font-bold mb-4">How long do you have?</h2>
        {['30 min', '1 hr', '2 hrs', '3+ hrs', 'All day'].map((duration) => (
          <button
            key={duration}
            onClick={() => {
              setSelectedDuration(duration);
              setCurrentScreen('main');
            }}
            className={`w-full p-4 mb-2 rounded-lg border-2 text-left ${
              selectedDuration === duration
                ? 'border-red-500 bg-red-50'
                : 'border-gray-200'
            }`}
          >
            {duration}
          </button>
        ))}
      </div>
    );
  }

  // Main screen
  return (
    <div className="min-h-screen bg-white p-4 max-w-sm mx-auto">
      {/* Header */}
      <div className="text-blue-600 font-bold text-lg mb-6">TOT TROT</div>

      {/* Location Selector */}
      <div className="mb-4">
        <div className="bg-blue-500 text-white px-6 py-3 rounded-full flex items-center justify-between">
          <span>📍 {selectedLocation}</span>
          <button 
            className="text-xs bg-blue-400 px-3 py-1 rounded-full"
            onClick={() => setCurrentScreen('location')}
          >
            CHANGE
          </button>
        </div>
      </div>

      {/* Duration Selector */}
      <div className="mb-6">
        <div className="bg-red-500 text-white px-6 py-3 rounded-full flex items-center justify-between">
          <span>🕐 {selectedDuration}</span>
          <button 
            className="text-xs bg-red-400 px-3 py-1 rounded-full"
            onClick={() => setCurrentScreen('duration')}
          >
            CHANGE
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-yellow-400 p-4 rounded-2xl mb-6">
        <div className="text-black font-bold text-xl mb-4">Find something</div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {filterOptions.map((filter) => (
            <button
              key={filter}
              onClick={() => toggleFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium border border-black ${
                selectedFilters.includes(filter)
                  ? 'bg-black text-yellow-400'
                  : 'bg-transparent text-black'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Go Button */}
      <button
        onClick={handleSearch}
        disabled={loading}
        className={`w-full py-4 rounded-full text-xl font-bold ${
          loading 
            ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
            : 'bg-black text-white'
        }`}
      >
        {loading ? 'Searching...' : 'Go'}
      </button>

      {/* API Status */}
      <div className="mt-4 text-center">
        <div className="text-xs text-gray-500">
          🔄 Connected to live activity database
        </div>
      </div>
    </div>
  );
}

export default App;
