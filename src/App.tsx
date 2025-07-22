import { useState } from 'react';

interface Activity {
  id: number;
  title: string;
  description: string;
  duration: string;
  tags: string[];
  rating: number;
  category: string;
}

const FamilyActivityApp = () => {
  const [currentScreen, setCurrentScreen] = useState<string>('main');
  const [selectedLocation, setSelectedLocation] = useState<string>('Berkeley');
  const [selectedDuration, setSelectedDuration] = useState<string>('2 hrs');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  // Sample activities data
  const sampleActivities: Activity[] = [
    {
      id: 1,
      title: "Corner Store Adventure",
      description: "Short walk to local store, practice counting and colors",
      duration: "2-3 hrs away (5 min)",
      tags: ["walking skills", "language development", "independence"],
      rating: 4.8,
      category: "outdoor"
    },
    {
      id: 2,
      title: "Library Story Time",
      description: "Interactive stories and songs for toddlers",
      duration: "1 hr",
      tags: ["reading", "social skills", "indoor"],
      rating: 4.5,
      category: "indoor"
    },
    {
      id: 3,
      title: "Nature Walk in Tilden",
      description: "Explore trails and playground areas",
      duration: "2-3 hrs",
      tags: ["nature", "physical activity", "outdoor"],
      rating: 4.7,
      category: "outdoor"
    }
  ];

  const filterOptions: string[] = [
    'OUTDOOR', 'INDOOR', 'LOW ENERGY', 'HIGH ENERGY', 
    'CALMING', 'FREE', 'UNDER $20', '$20+'
  ];

  const interestCategories: string[] = [
    'Playgrounds', 'Music & Dance', 'Animals & Nature', 'Water Play',
    'Sensory Play', 'Learning & Books', 'Social & Playgroups'
  ];

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const toggleInterest = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSearch = () => {
    let filtered = sampleActivities;
    
    if (selectedFilters.includes('OUTDOOR')) {
      filtered = filtered.filter(a => a.category === 'outdoor');
    }
    if (selectedFilters.includes('INDOOR')) {
      filtered = filtered.filter(a => a.category === 'indoor');
    }
    if (selectedFilters.includes('FREE')) {
      filtered = filtered.filter(a => a.tags.includes('free') || a.title.includes('free'));
    }
    
    setActivities(filtered);
    setCurrentScreen('results');
  };

  // Main Search Screen
  const MainScreen = () => (
    <div className="min-h-screen bg-white p-4 max-w-sm mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-blue-600 font-bold text-lg">TOT TROT</div>
        <div className="w-6 h-6 text-gray-600">⚙️</div>
      </div>

      {/* Location Selector */}
      <div className="mb-4">
        <div className="bg-blue-500 text-white px-6 py-3 rounded-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>📍</span>
            <span className="font-medium">{selectedLocation}</span>
          </div>
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
          <div className="flex items-center gap-2">
            <span>🕐</span>
            <span className="font-medium">{selectedDuration}</span>
          </div>
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

        <button 
          className="text-xs text-black border border-black px-3 py-1 rounded-full"
          onClick={() => setCurrentScreen('interests')}
        >
          SEE ALL
        </button>
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

  // Results Screen
  const ResultsScreen = () => (
    <div className="min-h-screen bg-white p-4 max-w-sm mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <div className="bg-blue-500 text-white px-4 py-2 rounded-full flex items-center gap-2">
            <span>📍</span>
            <span>San Francisco</span>
          </div>
          <div className="bg-red-500 text-white px-4 py-2 rounded-full flex items-center gap-2">
            <span>🕐</span>
            <span>2 hrs</span>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      <div className="flex gap-2 mb-4">
        {selectedFilters.slice(0, 3).map((filter) => (
          <span key={filter} className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-medium">
            {filter}
          </span>
        ))}
        {selectedFilters.length > 3 && (
          <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs">
            +{selectedFilters.length - 3} more
          </span>
        )}
      </div>

      {/* Activity Cards */}
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="bg-yellow-400 p-4 rounded-2xl">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-black text-lg">{activity.title}</h3>
              <button className="bg-black text-yellow-400 p-2 rounded-full">
                ⭐
              </button>
            </div>
            
            <p className="text-black text-sm mb-3">{activity.description}</p>
            
            <div className="text-black text-xs mb-2">{activity.duration}</div>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {activity.tags.map((tag, idx) => (
                <span key={idx} className="text-xs text-black">
                  {tag}{idx < activity.tags.length - 1 ? ', ' : ''}
                </span>
              ))}
            </div>
            
            <div className="flex items-center gap-1">
              <span className="text-black text-sm">Perfect for: ⭐⭐⭐⭐⭐</span>
            </div>
          </div>
        ))}
      </div>

      {/* Back Button */}
      <button
        onClick={() => setCurrentScreen('main')}
        className="w-full bg-black text-white py-3 rounded-full mt-6 font-medium"
      >
        New Search
      </button>
    </div>
  );

  // Interests Screen
  const InterestsScreen = () => (
    <div className="min-h-screen bg-green-500 p-4 max-w-sm mx-auto text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="font-bold text-lg">Birthday</div>
        <div className="flex gap-2">
          <span className="bg-green-400 px-4 py-2 rounded-full">August</span>
          <span className="bg-green-400 px-4 py-2 rounded-full">2024</span>
        </div>
      </div>

      {/* Interests Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Interests</h2>
        <div className="flex flex-wrap gap-3">
          {interestCategories.map((interest) => (
            <button
              key={interest}
              onClick={() => toggleInterest(interest)}
              className={`px-4 py-2 rounded-full text-sm font-medium border-2 border-white ${
                interests.includes(interest)
                  ? 'bg-white text-green-500'
                  : 'bg-transparent text-white'
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      {/* Profile Actions */}
      <div className="space-y-4">
        <button className="w-full text-left py-3 border-b border-green-400 text-white">
          Delete Profile
        </button>
        <button className="w-full text-left py-3 border-b border-green-400 text-white">
          Disable Profile
        </button>
      </div>

      {/* Back Button */}
      <button
        onClick={() => setCurrentScreen('main')}
        className="w-full bg-white text-green-500 py-3 rounded-full mt-8 font-bold"
      >
        Save & Return
      </button>
    </div>
  );

  // Location Selector Screen
  const LocationScreen = () => (
    <div className="min-h-screen bg-white p-4 max-w-sm mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="text-blue-600 font-bold text-lg">TOT TROT</div>
        <span>⚙️</span>
      </div>

      <h2 className="text-xl font-bold mb-4">Select Location</h2>
      
      <div className="space-y-3">
        {['Berkeley', 'San Francisco', 'Oakland', 'San Jose'].map((city) => (
          <button
            key={city}
            onClick={() => {
              setSelectedLocation(city);
              setCurrentScreen('main');
            }}
            className={`w-full p-4 rounded-lg border-2 text-left ${
              selectedLocation === city
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200'
            }`}
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );

  // Duration Selector Screen  
  const DurationScreen = () => (
    <div className="min-h-screen bg-white p-4 max-w-sm mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="text-blue-600 font-bold text-lg">TOT TROT</div>
        <span>⚙️</span>
      </div>

      <h2 className="text-xl font-bold mb-4">How long do you have?</h2>
      
      <div className="space-y-3">
        {['30 min', '1 hr', '2 hrs', '3+ hrs', 'All day'].map((duration) => (
          <button
            key={duration}
            onClick={() => {
              setSelectedDuration(duration);
              setCurrentScreen('main');
            }}
            className={`w-full p-4 rounded-lg border-2 text-left ${
              selectedDuration === duration
                ? 'border-red-500 bg-red-50'
                : 'border-gray-200'
            }`}
          >
            {duration}
          </button>
        ))}
      </div>
    </div>
  );

  // Render current screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'results':
        return <ResultsScreen />;
      case 'interests':
        return <InterestsScreen />;
      case 'location':
        return <LocationScreen />;
      case 'duration':
        return <DurationScreen />;
      default:
        return <MainScreen />;
    }
  };

  return <div className="bg-gray-100 min-h-screen">{renderScreen()}</div>;
};

export default FamilyActivityApp;
