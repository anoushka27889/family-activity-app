import { useState } from 'react';

function App() {
  const [currentScreen, setCurrentScreen] = useState('main');
  const [selectedLocation, setSelectedLocation] = useState('Berkeley');
  const [selectedDuration, setSelectedDuration] = useState('2 hrs');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const activities = [
    {
      id: 1,
      title: "Corner Store Adventure",
      description: "Short walk to local store, practice counting and colors",
      duration: "5 min away",
      category: "outdoor"
    },
    {
      id: 2,
      title: "Library Story Time", 
      description: "Interactive stories and songs for toddlers",
      duration: "1 hr",
      category: "indoor"
    },
    {
      id: 3,
      title: "Nature Walk in Tilden",
      description: "Explore trails and playground areas", 
      duration: "2-3 hrs",
      category: "outdoor"
    }
  ];

  const filterOptions = ['OUTDOOR', 'INDOOR', 'FREE', 'LOW ENERGY', 'HIGH ENERGY'];

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const handleSearch = () => {
    setCurrentScreen('results');
  };

  if (currentScreen === 'results') {
    return (
      <div className="min-h-screen bg-white p-4 max-w-sm mx-auto">
        <div className="flex gap-4 mb-4">
          <div className="bg-blue-500 text-white px-4 py-2 rounded-full">
            📍 {selectedLocation}
          </div>
          <div className="bg-red-500 text-white px-4 py-2 rounded-full">
            🕐 {selectedDuration}
          </div>
        </div>

        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="bg-yellow-400 p-4 rounded-2xl">
              <h3 className="font-bold text-black text-lg mb-2">{activity.title}</h3>
              <p className="text-black text-sm mb-2">{activity.description}</p>
              <div className="text-black text-xs">{activity.duration}</div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setCurrentScreen('main')}
          className="w-full bg-black text-white py-3 rounded-full mt-6"
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
        {['Berkeley', 'San Francisco', 'Oakland'].map((city) => (
          <button
            key={city}
            onClick={() => {
              setSelectedLocation(city);
              setCurrentScreen('main');
            }}
            className="w-full p-4 mb-2 rounded-lg border-2 border-gray-200 text-left"
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
        {['30 min', '1 hr', '2 hrs', '3+ hrs'].map((duration) => (
          <button
            key={duration}
            onClick={() => {
              setSelectedDuration(duration);
              setCurrentScreen('main');
            }}
            className="w-full p-4 mb-2 rounded-lg border-2 border-gray-200 text-left"
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
        className="w-full bg-black text-white py-4 rounded-full text-xl font-bold"
      >
        Go
      </button>
    </div>
  );
}

export default App;
