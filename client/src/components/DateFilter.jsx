import React, { useState } from "react";

export default function DateFilter({ onFilter }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleFilter = () => {
    onFilter({ startDate, endDate });
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Seach details</h2>
      
      {/* Flexbox container for the input fields */}
      <div className="flex space-x-4 mb-4">
        {/* Start Date input */}
        <div className="flex-1">
          <label className="block font-medium" htmlFor="start-date">
            Start Date
          </label>
          <input
            type="date"
            id="start-date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="MM/DD/YYYY"  // Placeholder text (won't display in most browsers with date type)
            className="mt-2 w-full rounded-lg border-gray-300 shadow p-2"
          />
        </div>

        {/* End Date input */}
        <div className="flex-1">
          <label className="block font-medium" htmlFor="end-date">
            End Date
          </label>
          <input
            type="date"
            id="end-date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="MM/DD/YYYY"  // Placeholder text (won't display in most browsers with date type)
            className="mt-2 w-full rounded-lg border-gray-300 shadow p-2"
          />
        </div>
      </div>

      {/* Apply Filter button */}
      <button
        onClick={handleFilter}
        className="w-full bg-blue-500 text-white py-2 rounded-lg shadow hover:bg-blue-600"
        disabled={!startDate || !endDate}
      >
        Search
      </button>
    </div>
  );
}
