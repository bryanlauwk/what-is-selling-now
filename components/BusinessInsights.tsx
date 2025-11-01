
import React from 'react';
import { StrategicInsights } from '../types';
import { LightbulbIcon, TargetIcon, RocketIcon } from './icons';

interface BusinessInsightsProps {
  insights: StrategicInsights;
}

const BusinessInsights: React.FC<BusinessInsightsProps> = ({ insights }) => {
  if (!insights) return null;

  return (
    <div className="mb-8 p-4 border border-fuchsia-500/50 bg-fuchsia-900/10">
      <h2 className="text-2xl font-bold font-mono text-fuchsia-300 mb-6">Your Strategic Insights</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <LightbulbIcon className="h-6 w-6 text-fuchsia-400 flex-shrink-0" />
            <h3 className="text-lg font-bold font-mono text-fuchsia-300 uppercase tracking-wider">Market Insight</h3>
          </div>
          <p className="text-gray-300 font-mono text-sm leading-relaxed">{insights.marketInsight}</p>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <TargetIcon className="h-6 w-6 text-fuchsia-400 flex-shrink-0" />
            <h3 className="text-lg font-bold font-mono text-fuchsia-300 uppercase tracking-wider">Opportunity Gaps</h3>
          </div>
          <ul className="list-disc list-inside space-y-2">
            {insights.opportunityGaps.map((gap, index) => (
              <li key={index} className="text-gray-300 font-mono text-sm leading-relaxed">{gap}</li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <RocketIcon className="h-6 w-6 text-fuchsia-400 flex-shrink-0" />
            <h3 className="text-lg font-bold font-mono text-fuchsia-300 uppercase tracking-wider">Go-to-Market</h3>
          </div>
          <ul className="list-disc list-inside space-y-2">
            {insights.go_to_market_strategy.map((strategy, index) => (
              <li key={index} className="text-gray-300 font-mono text-sm leading-relaxed">{strategy}</li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
};

export default BusinessInsights;
