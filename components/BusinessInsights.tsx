
import React from 'react';
import { StrategicInsights } from '../types';
import { LightbulbIcon, TargetIcon, RocketIcon } from './icons';

interface BusinessInsightsProps {
  insights: StrategicInsights;
}

const BusinessInsights: React.FC<BusinessInsightsProps> = ({ insights }) => {
  if (!insights) return null;

  const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 className="text-center text-sm font-mono uppercase tracking-widest text-gray-400 mb-4 mt-8">
      {children}
    </h3>
  );

  const InsightCard: React.FC<{ icon: React.ReactNode, text: string }> = ({ icon, text }) => (
    <div className="flex items-start gap-4 p-4 bg-gray-800/50 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-900 border border-gray-600">
        {icon}
      </div>
      <p className="text-gray-300 font-mono text-sm leading-relaxed pt-1.5">{text}</p>
    </div>
  );

  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
      <header className="text-center">
        <h2 className="text-2xl font-bold font-mono text-fuchsia-300 mb-2 uppercase tracking-widest">
          Your Strategic Blueprint
        </h2>
        <p className="text-gray-400 font-mono text-sm max-w-2xl mx-auto">
          A tailored analysis based on your business context and real-time market signals.
        </p>
      </header>
      
      <div className="mt-8 p-6 border border-gray-700 bg-gray-900/50">
          <div className="flex items-center gap-3 mb-3">
              <LightbulbIcon className="h-6 w-6 text-fuchsia-400 flex-shrink-0" />
              <h3 className="text-lg font-bold font-mono text-fuchsia-300 uppercase tracking-wider">Executive Summary</h3>
          </div>
          <p className="text-gray-300 font-mono text-sm leading-relaxed whitespace-pre-line">
              {insights.executiveSummary}
          </p>
          <p className="mt-4 text-gray-400 font-mono text-xs italic border-t border-gray-700 pt-3">
              <strong>Market Insight:</strong> {insights.marketInsight}
          </p>
      </div>

      <div className="mt-10">
        <SectionHeader>Opportunity Gaps</SectionHeader>
        <div className="space-y-3">
          {insights.opportunityGaps.map((gap, index) => (
            <InsightCard 
              key={index}
              text={gap}
              icon={<TargetIcon className="h-5 w-5 text-fuchsia-300" />}
            />
          ))}
        </div>

        <SectionHeader>Actionable Next Steps</SectionHeader>
        <div className="space-y-3">
          {insights.actionableNextSteps.map((step, index) => (
            <InsightCard 
              key={index}
              text={step}
              icon={<RocketIcon className="h-5 w-5 text-lime-400" />}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusinessInsights;
