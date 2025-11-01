

import React, { useState, useEffect, useCallback } from 'react';
import { TrendData, ProductTrend } from '../types';
import TrendNavigator from './TrendNavigator';
import TrendDeepDive from './TrendDeepDive';
import BusinessInsights from './BusinessInsights';
import { ShareIcon, BackArrowIcon } from './icons';

interface TrendWorkspaceProps {
  trendData: TrendData;
  onBack: () => void;
  country: string;
}

type ActiveTab = 'deepDive' | 'strategy';

const TrendWorkspace: React.FC<TrendWorkspaceProps> = ({ 
  trendData, 
  onBack, 
  country,
}) => {
  const [selectedTrend, setSelectedTrend] = useState<ProductTrend | null>(null);
  const [copyButtonText, setCopyButtonText] = useState('SHARE');
  const [activeTab, setActiveTab] = useState<ActiveTab>('deepDive');

  useEffect(() => {
    // Reset to the deep dive tab whenever new data comes in
    setActiveTab('deepDive');

    if (trendData?.products && trendData.products.length > 0) {
      setSelectedTrend(trendData.products[0]);
    } else {
      setSelectedTrend(null);
    }
  }, [trendData]);

  const handleShareClick = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyButtonText('LINK COPIED!');
      setTimeout(() => setCopyButtonText('SHARE'), 2000);
    } catch (err) {
      console.error('Failed to copy link: ', err);
      setCopyButtonText('FAILED');
      setTimeout(() => setCopyButtonText('SHARE'), 2000);
    }
  }, []);

  const TabButton: React.FC<{tabName: ActiveTab, currentTab: ActiveTab, children: React.ReactNode, disabled?: boolean}> = ({ tabName, currentTab, children, disabled }) => {
    const isActive = tabName === currentTab;
    return (
      <button
        onClick={() => !disabled && setActiveTab(tabName)}
        disabled={disabled}
        className={`px-4 py-2 text-sm font-bold font-mono border-b-2 transition-colors duration-200
          ${isActive ? 'border-lime-400 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {children}
      </button>
    );
  }

  if (!trendData) return null;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 border border-gray-500 text-sm font-bold rounded-none text-gray-300 bg-transparent hover:bg-gray-800"
        >
          <BackArrowIcon className="h-4 w-4" />
          BACK TO FILTERS
        </button>
        <button
          onClick={handleShareClick}
          className="flex items-center gap-2 px-4 py-2 border border-gray-500 text-sm font-bold rounded-none text-gray-300 bg-transparent hover:bg-gray-800 disabled:opacity-50"
          aria-label="Share results"
          disabled={!trendData.products || trendData.products.length === 0}
        >
          <ShareIcon className="h-4 w-4" />
          {copyButtonText}
        </button>
      </div>

      {trendData.products.length === 0 ? (
        <div className="mt-8 border border-gray-700 p-16 text-center font-mono">
          <h3 className="text-2xl">NO RESULTS FOUND</h3>
          <p className="text-gray-400">Try different filters or a broader business description.</p>
        </div>
      ) : (
        <div className="mt-4 md:mt-8 flex flex-col md:flex-row gap-0 border border-gray-700">
          <div className="w-full md:w-1/3 lg:w-1/4 border-b md:border-b-0 md:border-r border-gray-700">
            <TrendNavigator
              products={trendData.products}
              selectedTrend={selectedTrend}
              onSelect={setSelectedTrend}
            />
          </div>
          <div className="w-full md:w-2/3 lg:w-3/4">
            <div className="flex border-b border-gray-700 px-4">
                <TabButton tabName="deepDive" currentTab={activeTab}>
                    Trend Analysis
                </TabButton>
                <TabButton tabName="strategy" currentTab={activeTab} disabled={!trendData.insights}>
                    Strategic Blueprint
                </TabButton>
            </div>
            
            <div className="p-4 md:p-6 lg:p-8">
              {activeTab === 'deepDive' && (
                <TrendDeepDive
                  trend={selectedTrend}
                  country={country}
                  sources={trendData.sources}
                />
              )}
              {activeTab === 'strategy' && trendData.insights && (
                 <BusinessInsights insights={trendData.insights} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendWorkspace;