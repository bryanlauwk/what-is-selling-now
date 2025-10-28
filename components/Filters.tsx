import React from 'react';
import { COUNTRIES, CATEGORIES, TIME_RANGES } from '../constants';

interface FiltersProps {
  country: string;
  setCountry: (country: string) => void;
  category: string;
  setCategory: (category: string) => void;
  timeRange: string;
  setTimeRange: (timeRange: string) => void;
  onFind: () => void;
  isLoading: boolean;
}

const Filters: React.FC<FiltersProps> = ({
  country, setCountry,
  category, setCategory,
  timeRange, setTimeRange,
  onFind, isLoading,
}) => {
  return (
    <div className="p-4 border-2 border-black">
      <div className="flex flex-col md:flex-row md:flex-nowrap gap-4 items-end">
        <div className="w-full md:flex-grow">
          <label htmlFor="country-select" className="block text-sm font-bold font-mono mb-1">Country</label>
          <select
            id="country-select"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full bg-white border border-black rounded-none p-2 focus:outline-none"
            disabled={isLoading}
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="w-full md:flex-grow">
          <label htmlFor="category-select" className="block text-sm font-bold font-mono mb-1">Category</label>
          <select
            id="category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-white border border-black rounded-none p-2 focus:outline-none"
            disabled={isLoading}
          >
            {CATEGORIES.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="w-full md:flex-grow">
          <label htmlFor="timerange-select" className="block text-sm font-bold font-mono mb-1">Time Range</label>
          <select
            id="timerange-select"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-full bg-white border border-black rounded-none p-2 focus:outline-none"
            disabled={isLoading}
          >
            {TIME_RANGES.map((t) => (
              <option key={t.code} value={t.code}>{t.name}</option>
            ))}
          </select>
        </div>
        <button
          onClick={onFind}
          disabled={isLoading}
          className="w-full md:flex-shrink-0 md:w-auto px-4 py-2 border border-black text-base font-bold rounded-none text-white bg-black hover:bg-gray-800 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {isLoading ? 'SEARCHING...' : 'FIND TRENDS'}
        </button>
      </div>
    </div>
  );
};

export default Filters;