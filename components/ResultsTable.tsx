import React from 'react';
import { ProductTrend, SortConfig, SortableKeys } from '../types';
import SparkLineChart from './SparkLineChart';
import { UpArrowIcon, DownArrowIcon, StableIcon, SortAscIcon, SortDescIcon } from './icons';

interface ResultsTableProps {
  results: ProductTrend[];
  timeRangeName: string;
  sortConfig: SortConfig;
  onSort: (key: SortableKeys) => void;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ results, timeRangeName, sortConfig, onSort }) => {
  const getGrowthIndicator = (growth: number) => {
    if (growth > 5) return <UpArrowIcon className="h-4 w-4 text-green-500" />;
    if (growth < -5) return <DownArrowIcon className="h-4 w-4 text-red-500" />;
    return <StableIcon className="h-4 w-4 text-black" />;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-black';
  };
  
  const renderSortIcon = (key: SortableKeys) => {
    if (sortConfig.key !== key) return null;
    return (
      <span className="ml-2">
        {sortConfig.direction === 'ascending' ? <SortAscIcon className="h-4 w-4" /> : <SortDescIcon className="h-4 w-4" />}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-black text-white">
          <tr>
            <th scope="col" className="p-0 text-left text-sm font-mono uppercase tracking-widest border border-black">
              <button onClick={() => onSort('rank')} className="w-full flex items-center justify-between p-2 md:p-3 text-left">
                <span>Rank</span>
                {renderSortIcon('rank')}
              </button>
            </th>
            <th scope="col" className="p-0 text-left text-sm font-mono uppercase tracking-widest border border-black">
              <button onClick={() => onSort('productName')} className="w-full flex items-center justify-between p-2 md:p-3 text-left">
                <span>Product</span>
                {renderSortIcon('productName')}
              </button>
            </th>
            <th scope="col" className="hidden md:table-cell p-3 text-left text-sm font-mono uppercase tracking-widest border border-black">Examples</th>
            <th scope="col" className="p-0 text-left text-sm font-mono uppercase tracking-widest border border-black">
              <button onClick={() => onSort('growth')} className="w-full flex items-center justify-between p-2 md:p-3 text-left">
                <span>Growth</span>
                {renderSortIcon('growth')}
              </button>
            </th>
            <th scope="col" className="hidden lg:table-cell p-3 text-left text-sm font-mono uppercase tracking-widest border border-black">Trend ({timeRangeName})</th>
            <th scope="col" className="hidden md:table-cell p-3 text-left text-sm font-mono uppercase tracking-widest border border-black">Suppliers</th>
          </tr>
        </thead>
        <tbody>
          {results.map((item) => (
            <tr key={item.productName + item.rank} className="bg-white">
              <td className="p-2 md:p-3 whitespace-nowrap border border-black">
                <div className="text-xl md:text-2xl font-bold text-black">{item.rank}</div>
              </td>
              <td className="p-2 md:p-3 whitespace-nowrap border border-black">
                <div className="text-base md:text-lg font-bold text-black">{item.productName}</div>
                <div className="text-xs md:text-sm text-gray-600 font-mono">{item.trend}</div>
              </td>
              <td className="hidden md:table-cell p-3 border border-black">
                 <div className="flex flex-wrap gap-1 max-w-xs">
                    {item.examples?.map((example, index) => (
                        <span key={index} className="px-2 py-0.5 text-xs font-mono bg-white text-black border border-black rounded-none">
                            {example}
                        </span>
                    ))}
                </div>
              </td>
              <td className="p-2 md:p-3 whitespace-nowrap border border-black">
                <div className={`flex items-center text-base md:text-lg font-bold ${getGrowthColor(item.growth)}`}>
                  {getGrowthIndicator(item.growth)}
                  <span className="ml-1.5">{item.growth > 0 ? '+' : ''}{item.growth}%</span>
                </div>
              </td>
              <td className="hidden lg:table-cell p-3 whitespace-nowrap border border-black">
                <div className="w-32 h-10">
                   <SparkLineChart data={item.trendData} color={item.growth > 0 ? '#22c55e' : '#ef4444'} />
                </div>
              </td>
              <td className="hidden md:table-cell p-3 border border-black">
                <div className="flex flex-wrap gap-1 max-w-xs">
                    {item.suppliers?.map((supplier, index) => (
                        <span key={index} className="px-2 py-0.5 text-xs font-mono bg-white text-black border border-black rounded-none">
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