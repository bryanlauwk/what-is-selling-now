
import React from 'react';
import { StrategicInsights } from '../types';
import { LightbulbIcon, TargetIcon, RocketIcon } from './icons';

interface BusinessInsightsProps {
  insights: StrategicInsights;
}

const BusinessInsights: React.FC<BusinessInsightsProps> = ({ insights }) => {
  if (!insights) return null;

  return (
    <div className="bg-gray-900/50">
      <h2 className="text-2xl font-bold font-mono text-fuchsia-300 mb-2 uppercase tracking-widest">Your Strategic Blueprint</h2>
      <p className="text-gray-400 font-mono text-sm mb-6 leading-relaxed">{insights.executiveSummary}</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6 border-t border-fuchsia-500/30">
        
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-3">
            <LightbulbIcon className="h-6 w-6 text-fuchsia-400 flex-shrink-0" />
            <h3 className="text-lg font-bold font-mono text-fuchsia-300 uppercase tracking-wider">Market Insight</h3>
          </div>
          <p className="text-gray-300 font-mono text-sm leading-relaxed">{insights.marketInsight}</p>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-3">
            <TargetIcon className="h-6 w-6 text-fuchsia-400 flex-shrink-0" />
            <h3 className="text-lg font-bold font-mono text-fuchsia-300 uppercase tracking-wider">Opportunity Gaps</h3>
          </div>
          <div className="space-y-3">
            {insights.opportunityGaps.map((gap, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center bg-gray-800/50 mt-1 rounded-sm">
                  <TargetIcon className="h-3 w-3 text-fuchsia-400" />
                </div>
                <p className="text-gray-300 font-mono text-sm leading-relaxed">{gap}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-3">
            <RocketIcon className="h-6 w-6 text-fuchsia-400 flex-shrink-0" />
            <h3 className="text-lg font-bold font-mono text-fuchsia-300 uppercase tracking-wider">Actionable Next Steps</h3>
          </div>
          <div className="space-y-3">
            {insights.actionableNextSteps.map((strategy, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center bg-gray-800/50 mt-1 rounded-sm">
                  <RocketIcon className="h-3 w-3 text-fuchsia-400" />
                </div>
                <p className="text-gray-300 font-mono text-sm leading-relaxed">{strategy}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default BusinessInsights;