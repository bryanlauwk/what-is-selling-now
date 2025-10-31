
import React from 'react';
import { COUNTRIES, CATEGORIES, TIME_RANGES, LIST_SIZES } from '../constants';

interface FiltersProps {
  country: string;
  setCountry: (country: string) => void;
  category: string;
  setCategory: (category: string) => void;
  timeRange: string;
  setTimeRange: (timeRange: string) => void;
  listSize: number;
  setListSize: (size: number) => void;
  onFind: () => void;
  isLoading: boolean;
}

const Filters: React.FC<FiltersProps> = ({
  country, setCountry,
  category, setCategory,
  timeRange, setTimeRange,
  listSize, setListSize,
  onFind, isLoading,
}) => {
  return (
    <div className="p-4 border border-gray-500">
      <div className="flex flex-col md:flex-row md:flex-nowrap gap-4 items-end">
        <div className="w-full md:flex-grow">
          <label htmlFor="country-select" className="block text-sm font-bold font-mono mb-1 text-gray-400">Country</label>
          <select
            id="country-select"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full bg-black border border-gray-500 rounded-none p-2 focus:outline-none focus:border-lime-400 text-white"
            disabled={isLoading}
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="w-full md:flex-grow">
          <label htmlFor="category-select" className="block text-sm font-bold font-mono mb-1 text-gray-400">Category</label>
          <select
            id="category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-black border border-gray-500 rounded-none p-2 focus:outline-none focus:border-lime-400 text-white"
            disabled={isLoading}
          >
            {CATEGORIES.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="w-full md:flex-grow">
          <label htmlFor="timerange-select" className="block text-sm font-bold font-mono mb-1 text-gray-400">Time Range</label>
          <select
            id="timerange-select"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-full bg-black border border-gray-500 rounded-none p-2 focus:outline-none focus:border-lime-400 text-white"
            disabled={isLoading}
          >
            {TIME_RANGES.map((t) => (
              <option key={t.code} value={t.code}>{t.name}</option>
            ))}
          </select>
        </div>
        <div className="w-full md:flex-grow">
          <label htmlFor="listsize-select" className="block text-sm font-bold font-mono mb-1 text-gray-400">List Size</label>
          <select
            id="listsize-select"
            value={listSize}
            onChange={(e) => setListSize(Number(e.target.value))}
            className="w-full bg-black border border-gray-500 rounded-none p-2 focus:outline-none focus:border-lime-400 text-white"
            disabled={isLoading}
          >
            {LIST_SIZES.map((s) => (
              <option key={s.value} value={s.value}>{s.name}</option>
            ))}
          </select>
        </div>
        <div className="w-full md:w-auto flex-shrink-0 flex gap-2">
            <button
              onClick={onFind}
              disabled={isLoading}
              className="w-full px-6 py-2 border border-lime-400 text-base font-bold rounded-none text-black bg-lime-400 hover:bg-lime-300 disabled:bg-gray-600 disabled:border-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'SEARCHING...' : 'DISCOVER TRENDS'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default Filters;
