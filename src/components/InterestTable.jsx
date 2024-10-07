import React, { useState } from 'react';
import * as XLSX from 'xlsx'; // Import XLSX for Excel download

const InterestTable = ({ interests }) => {
  const [sortedInterests, setSortedInterests] = useState(interests);
  const [selectedInterests, setSelectedInterests] = useState([]);

  // Handle selection of interests
  const handleSelect = (interestName) => {
    if (selectedInterests.includes(interestName)) {
      // Remove if already selected
      setSelectedInterests(selectedInterests.filter(name => name !== interestName));
    } else {
      // Add to selected
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
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Interests');
    XLSX.writeFile(workbook, 'selected_interests.xlsx');
  };

  return (
    <div className="overflow-x-auto w-full">
      {/* Display Copy and Download buttons if any interest is selected */}
      <span className='text-green-500'>Please select your interest from the table below to proceed with copying or downloading the relevant content</span>
      {selectedInterests.length > 0 && (
        <div className="flex justify-between mb-4">
          <button
            onClick={handleCopy}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Copy Selected
          </button>
          <button
            onClick={handleDownloadExcel}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
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
            <th className="p-4 border text-center">Interest</th>
          </tr>
        </thead>
        <tbody>
          {sortedInterests.map((interest, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="p-4 border text-center">
                <input
                  type="checkbox"
                  checked={selectedInterests.includes(interest.name)}
                  onChange={() => handleSelect(interest.name)}
                />
              </td>
              <td className="p-4 border">{interest.name || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InterestTable;
