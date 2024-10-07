import React from 'react';

const SearchBar = ({ onSearch, query, setQuery }) => {
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      onSearch(); // Trigger search on Enter key press
    }
  };

  return (
    <div className="flex justify-center mb-6">
      <input
        type="text"
        placeholder="Enter a broad interest or custom prompt..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress} // Handle Enter key press
        className="border border-gray-300 p-2 w-96 rounded-l-md"
      />
      <button
        onClick={onSearch}
        className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600"
      >
        Explore
      </button>
    </div>
  );
};

export default SearchBar;
