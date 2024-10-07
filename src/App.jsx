import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import InterestTable from './components/InterestTable';
import { fetchInterests } from './api/api'; // Graph API function
import { fetchGPTResponse } from './api/openaiApi'; // OpenAI API function
import Footer from './components/Footer';
import Header from './components/Header';
import Switcher11 from './components/Switcher11'; // Importing the switcher

const App = () => {
  const [query, setQuery] = useState('');
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [business, setBusiness] = useState(''); // To capture business type for OpenAI
  const [services, setServices] = useState(''); // To capture services for OpenAI
  const [region, setRegion] = useState('India'); // To capture region for OpenAI
  const [isOpenAiSelected, setIsOpenAiSelected] = useState(false); // Added to manage OpenAI mode from switcher

  const handleSearch = async () => {
    console.log('Searching for interests...');
    setLoading(true); // Show loading spinner

    if (!isOpenAiSelected) {
      // Fetch from Graph API
      const results = await fetchInterests(query);
      setInterests(results); // Update interests with Graph API results
    } else if (isOpenAiSelected) {
      // Fetch response from OpenAI API with dynamic business, services, and region
      const prompt = `I am a ${business} selling ${services} across ${region}. 
        Please give me a detailed list of Facebook interests. 
        Please give me the list only so that I can target directly. 
        Please provide at least 50 interests, but preferably 70 or more.`;
      const gptResponse = await fetchGPTResponse(prompt);
      setInterests(gptResponse); // Update interests with OpenAI results
    }

    setLoading(false); // Hide loading spinner
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header with Switcher */}
      <Header isChecked={isOpenAiSelected} setIsChecked={setIsOpenAiSelected} />

      <div className="flex-grow flex flex-col justify-center items-center p-10 bg-white">
        <div className="container mx-auto bg-white rounded-lg p-10">
          <h1 className="text-3xl font-bold text-center mb-6">MBG Interest Finder</h1>

          {/* Conditionally show input fields if OpenAI is selected */}
          {isOpenAiSelected && (
            <div>
              <div className="flex justify-center mb-6">
                <input
                  type="text"
                  placeholder="Enter your business (e.g., website developer)"
                  value={business}
                  onChange={(e) => setBusiness(e.target.value)}
                  className="border border-gray-300 p-2 w-96 rounded-l-md"
                />
              </div>

              <div className="flex justify-center mb-6">
                <input
                  type="text"
                  placeholder="Enter your services (e.g., e-commerce website development, mobile app development)"
                  value={services}
                  onChange={(e) => setServices(e.target.value)}
                  className="border border-gray-300 p-2 w-96 rounded-l-md"
                />
              </div>

              <div className="flex justify-center mb-6">
                <input
                  type="text"
                  placeholder="Enter your region (e.g., India)"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="border border-gray-300 p-2 w-96 rounded-l-md"
                />
              </div>
            </div>
          )}

          {/* Search bar */}
          <SearchBar onSearch={handleSearch} query={query} setQuery={setQuery} />

          {/* Interest Table */}
          <div className="w-full mt-10">
            {loading ? (
              <div className="flex justify-center">
                <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
              </div>
            ) : interests.length > 0 ? (
              <InterestTable interests={interests} />
            ) : (
              <p className="text-center text-gray-500">No data to display. Please search for interests.</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
      <div className="mb-5"></div>
    </div>
  );
};

export default App;
