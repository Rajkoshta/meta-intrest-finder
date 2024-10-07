import React, { useState } from 'react';
import * as XLSX from 'xlsx'; // Import XLSX for Excel download

// Function to format numbers into K (thousands) or M (millions)
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'; // Format as millions
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'; // Format as thousands
  }
  return num.toString(); // If less than 1000, show the full number
};

const InterestTableGraphAPI = ({ interests }) => {
  const [sortedInterests, setSortedInterests] = useState(interests);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [selectedInterests, setSelectedInterests] = useState([]);

  // Sorting function
  const sortTable = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }

    const sortedData = [...sortedInterests].sort((a, b) => {
      if (key === 'audience_size') {
        const aAudience = a.audience_size_lower_bound || 0;
        const bAudience = b.audience_size_lower_bound || 0;
        return direction === 'ascending' ? aAudience - bAudience : bAudience - aAudience;
      } else {
        return direction === 'ascending'
          ? a[key]?.localeCompare(b[key])
          : b[key]?.localeCompare(a[key]);
      }
    });

    setSortedInterests(sortedData);
    setSortConfig({ key, direction });
  };

  // Handle selection of interests
  const handleSelect = (interestName) => {
    if (selectedInterests.includes(interestName)) {
      setSelectedInterests(selectedInterests.filter(name => name !== interestName));
    } else {
      setSelectedInterests([...selectedInterests, interestName]);
    }
  };

  // Select all interests
  const handleSelectAll = () => {
    if (selectedInterests.length === sortedInterests.length) {
      setSelectedInterests([]); // Deselect all
    } else {
      setSelectedInterests(sortedInterests.map(interest => interest.name)); // Select all
    }
  };

  // Copy selected interests to clipboard
  const handleCopy = () => {
    const textToCopy = selectedInterests.join(', ');
    navigator.clipboard.writeText(textToCopy)
      .then(() => alert('Copied to clipboard: ' + textToCopy))
      .catch((error) => console.error('Error copying text to clipboard:', error));
  };

  // Download selected interests as Excel
  const handleDownloadExcel = () => {
    const filteredInterests = sortedInterests.filter(interest => selectedInterests.includes(interest.name));

    const worksheetData = filteredInterests.map(interest => ({
      Interest: interest.name,
      Audience_Size: interest.audience_size_lower_bound
        ? `${formatNumber(interest.audience_size_lower_bound)} - ${formatNumber(interest.audience_size_upper_bound)}`
        : 'N/A',
      Topic: interest.topic || 'N/A',
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Interests');
    XLSX.writeFile(workbook, 'selected_interests.xlsx');
  };

  return (
    <div className="overflow-x-auto w-full">
      {/* Display Copy and Download buttons if any interest is selected */}
      {selectedInterests.length > 0 && (
        <div className="flex justify-between mb-4">
          <button onClick={handleCopy} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            Copy Selected
          </button>
          <button onClick={handleDownloadExcel} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
            Download Excel
          </button>
        </div>
      )}

      <table className="table-auto w-full text-left p-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-4 border text-center">
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedInterests.length === sortedInterests.length && sortedInterests.length > 0}
              />
            </th>
            <th
              className="p-4 border cursor-pointer text-center"
              onClick={() => sortTable('name')}
            >
              Interest {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </th>
            <th
              className="p-4 border cursor-pointer text-center"
              onClick={() => sortTable('audience_size')}
            >
              Audience Size {sortConfig.key === 'audience_size' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </th>
            <th
              className="p-4 border cursor-pointer text-center"
              onClick={() => sortTable('topic')}
            >
              Topic {sortConfig.key === 'topic' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </th>
            <th className="p-4 border">Links</th>
          </tr>
        </thead>
        <tbody>
          {sortedInterests.map((interest, index) => {
            const audienceSize = interest.audience_size_lower_bound
              ? `${formatNumber(interest.audience_size_lower_bound)} - ${formatNumber(interest.audience_size_upper_bound)}`
              : 'N/A';

            return (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-4 border text-center">
                  <input
                    type="checkbox"
                    checked={selectedInterests.includes(interest.name)}
                    onChange={() => handleSelect(interest.name)}
                  />
                </td>
                <td className="p-4 border">{interest.name || 'N/A'}</td>
                <td className="p-4 border">{audienceSize}</td>
                <td className="p-4 border">{interest.topic || 'N/A'}</td>
                <td className="p-4 border">
                  <a href={`https://www.facebook.com/search?q=${interest.name}`} target="_blank" rel="noreferrer">
                    <i className="fab fa-facebook text-blue-500"></i>
                  </a>{' '}
                  <a href={`https://www.google.com/search?q=${interest.name}`} target="_blank" rel="noreferrer">
                    <i className="fab fa-google text-red-500"></i>
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default InterestTableGraphAPI;
