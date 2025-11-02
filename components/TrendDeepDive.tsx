

import React from 'react';
import { ProductTrend } from '../types';
import { GoogleTrendsIcon, InfoIcon } from './icons';

interface TrendDeepDiveProps {
  trend: ProductTrend | null;
  country: string;
}

const TrendDeepDive: React.FC<TrendDeepDiveProps> = ({ trend, country }) => {
  if (!trend) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <p className="text-gray-500 font-mono">Select a trend from the left to see the details.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 h-full overflow-y-auto animate-[fadeIn_0.5s_ease-out]">
      <header className="pb-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl md:text-3xl font-bold text-white">{trend.productName}</h2>
          <a
            href={`https://trends.google.com/trends/explore?q=${encodeURIComponent(trend.productName)}&geo=${country}`}
            target="_blank"
            rel="noopener noreferrer"
            title="View on Google Trends"
            className="text-gray-500 hover:text-lime-400 transition-colors flex-shrink-0"
            aria-label={`View ${trend.productName} on Google Trends`}
          >
            <GoogleTrendsIcon className="h-5 w-5" />
          </a>
        </div>
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center gap-1.5 group relative">
            <span className="text-sm font-mono text-gray-400">Trend Score</span>
            <InfoIcon className="h-4 w-4 text-gray-500" />
            <span className="absolute left-0 bottom-full mb-2 w-64 p-2 bg-gray-800 border border-gray-600 text-white text-xs rounded-md font-sans normal-case opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              A score (1-100) based on the trend's velocity, recency, and stability from Google Trends data. Higher scores indicate hotter trends.
            </span>
          </div>
          <span className="font-bold text-xl text-white">{trend.trendScore}</span>
          <div className="w-full max-w-xs h-2 bg-gray-700 rounded-full">
            <div className="h-2 bg-lime-400 rounded-full" style={{ width: `${trend.trendScore}%` }}></div>
          </div>
        </div>
      </header>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-sm font-mono uppercase tracking-widest text-gray-400 mb-3">Breakout Keywords</h3>
          <div className="space-y-3">
            {trend.breakoutKeywords?.length > 0 ? trend.breakoutKeywords.map((bk, index) => {
              const growthPercentage = Math.abs(bk.growth);
              const isPositive = bk.growth >= 0;
              const barColor = isPositive ? 'bg-green-500/30' : 'bg-red-500/30';
              const textColor = isPositive ? 'text-green-400' : 'text-red-400';
              const barWidth = Math.min(growthPercentage, 100);

              return (
                <div key={index} className="relative group overflow-hidden bg-gray-800/50 rounded-sm">
                  <div 
                    className={`absolute top-0 left-0 h-full transition-all duration-300 ${barColor}`}
                    style={{ width: `${barWidth}%` }}
                  ></div>
                  <div className="relative z-10 flex justify-between items-center p-2">
                    <a
                      href={`https://trends.google.com/trends/explore?q=${encodeURIComponent(bk.keyword)}&geo=${country}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`View ${bk.keyword} on Google Trends`}
                      className="text-base font-mono text-gray-200 group-hover:text-white"
                    >
                      {bk.keyword}
                    </a>
                    <span className={`text-sm font-bold font-mono ${textColor}`}>
                      {isPositive ? '+' : ''}{bk.growth}%
                    </span>
                  </div>
                </div>
              );
            }) : (
              <p className="text-gray-500 font-mono text-sm italic">No specific breakout keywords identified.</p>
            )}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-mono uppercase tracking-widest text-gray-400 mb-3">Related Products</h3>
          <div className="flex flex-wrap gap-2">
             {trend.relatedProducts?.length > 0 ? trend.relatedProducts.map((related, index) => (
              <span key={index} className="px-2 py-0.5 text-sm font-mono bg-fuchsia-900/50 text-fuchsia-300 border border-fuchsia-700 rounded-none">
                {related}
              </span>
            )) : (
              <p className="text-gray-500 font-mono text-sm italic">No related products found.</p>
            )}
          </div>
        </div>
        <div className="lg:col-span-2">
          <h3 className="text-sm font-mono uppercase tracking-widest text-gray-400 mb-3">Potential Suppliers</h3>
          <div className="flex flex-wrap gap-2">
             {trend.suppliers?.length > 0 ? trend.suppliers.map((supplier, index) => (
              <span key={index} className="px-2 py-0.5 text-sm font-mono bg-transparent text-gray-300 border border-gray-500 rounded-none">
                {supplier}
              </span>
            )) : (
              <p className="text-gray-500 font-mono text-sm italic">No specific suppliers identified.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendDeepDive;