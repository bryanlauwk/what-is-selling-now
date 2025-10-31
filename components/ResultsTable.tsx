
import React from 'react';
import { ProductTrend, SortConfig, SortableKeys } from '../types';
import { SortAscIcon, SortDescIcon, GoogleTrendsIcon, InfoIcon } from './icons';

interface ResultsTableProps {
  results: ProductTrend[];
  timeRangeName: string;
  sortConfig: SortConfig;
  onSort: (key: SortableKeys) => void;
  country: string;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ results, timeRangeName, sortConfig, onSort, country }) => {
  
  const renderSortIcon = (key: SortableKeys) => {
    if (sortConfig.key !== key) return null;
    return (
      <span className="ml-2">
        {sortConfig.direction === 'ascending' ? <SortAscIcon className="h-4 w-4" /> : <SortDescIcon className="h-4 w-4" />}
      </span>
    );
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-500';
    if (growth < 0) return 'text-red-500';
    return 'text-gray-400';
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="text-white border-b-2 border-lime-400">
          <tr>
            <th scope="col" className="p-0 text-left text-sm font-mono uppercase tracking-widest border-r border-gray-700">
              <button onClick={() => onSort('rank')} className="w-full flex items-center justify-between p-2 md:p-3 text-left">
                <span>Rank</span>
                {renderSortIcon('rank')}
              </button>
            </th>
            <th scope="col" className="p-0 text-left text-sm font-mono uppercase tracking-widest border-r border-gray-700">
              <button onClick={() => onSort('productName')} className="w-full flex items-center justify-between p-2 md:p-3 text-left">
                <span>Product</span>
                {renderSortIcon('productName')}
              </button>
            </th>
             <th scope="col" className="p-0 text-left text-sm font-mono uppercase tracking-widest border-r border-gray-700">
              <button onClick={() => onSort('trendScore')} className="w-full flex items-center justify-between p-2 md:p-3 text-left">
                <span className="flex items-center gap-1.5 group relative">
                    Trend Score
                    <InfoIcon className="h-4 w-4 text-gray-500" />
                    <span className="absolute left-0 top-full mt-2 w-64 p-2 bg-gray-800 border border-gray-600 text-white text-xs rounded-md font-sans normal-case opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        A score (1-100) based on the trend's velocity, recency, and stability from Google Trends data. Higher scores indicate hotter trends.
                    </span>
                </span>
                {renderSortIcon('trendScore')}
              </button>
            </th>
            <th scope="col" className="hidden xl:table-cell p-3 text-left text-sm font-mono uppercase tracking-widest border-r border-gray-700">Breakout Keywords</th>
            <th scope="col" className="hidden md:table-cell p-3 text-left text-sm font-mono uppercase tracking-widest">Suppliers</th>
          </tr>
        </thead>
        <tbody>
          {results.map((item) => (
            <tr key={item.productName + item.rank} className="border-t border-gray-700">
              <td className="p-2 md:p-3 whitespace-nowrap border-r border-gray-700 align-top">
                <div className="text-xl md:text-2xl font-bold text-white">{item.rank}</div>
              </td>
              <td className="p-2 md:p-3 border-r border-gray-700 align-top">
                 <div className="max-w-xs">
                    <div className="flex items-center gap-2">
                      <div className="text-base md:text-lg font-bold text-white">{item.productName}</div>
                      <a
                        href={`https://trends.google.com/trends/explore?q=${encodeURIComponent(item.productName)}&geo=${country}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View on Google Trends"
                        className="text-gray-500 hover:text-lime-400 transition-colors flex-shrink-0"
                        aria-label={`View ${item.productName} on Google Trends`}
                      >
                        <GoogleTrendsIcon className="h-4 w-4" />
                      </a>
                    </div>
                    {item.relatedProducts && item.relatedProducts.length > 0 && (
                        <div className="mt-2">
                        <span className="text-xs font-bold text-gray-500 font-mono uppercase">Also Consider:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                            {item.relatedProducts.map((related, index) => (
                            <span key={index} className="px-2 py-0.5 text-xs font-mono bg-fuchsia-900/50 text-fuchsia-300 border border-fuchsia-700 rounded-none">
                                {related}
                            </span>
                            ))}
                        </div>
                        </div>
                    )}
                </div>
              </td>
              <td className="p-2 md:p-3 whitespace-nowrap border-r border-gray-700 align-top">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg text-white w-8">{item.trendScore}</span>
                  <div className="w-full max-w-24 h-2 bg-gray-700 rounded-full">
                    <div className="h-2 bg-lime-400 rounded-full" style={{ width: `${item.trendScore}%` }}></div>
                  </div>
                </div>
              </td>
              <td className="hidden xl:table-cell p-3 border-r border-gray-700 align-top">
                 <div className="flex flex-col flex-wrap gap-2 max-w-xs">
                    {item.breakoutKeywords?.map((bk, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <a
                                href={`https://trends.google.com/trends/explore?q=${encodeURIComponent(bk.keyword)}&geo=${country}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={`View ${bk.keyword} on Google Trends`}
                                className="text-sm font-mono text-gray-300 hover:text-lime-400 hover:underline"
                            >
                                {bk.keyword}
                            </a>
                            <span className={`text-xs font-bold font-mono ${getGrowthColor(bk.growth)}`}>
                                ({bk.growth > 0 ? '+' : ''}{bk.growth}%)
                            </span>
                        </div>
                    ))}
                </div>
              </td>
              <td className="hidden md:table-cell p-3 align-top">
                <div className="flex flex-wrap gap-1 max-w-xs">
                    {item.suppliers?.map((supplier, index) => (
                        <span key={index} className="px-2 py-0.5 text-xs font-mono bg-transparent text-gray-300 border border-gray-500 rounded-none">
                            {supplier}
                        </span>
                    ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsTable;