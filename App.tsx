import React, { useState, useCallback, useMemo } from 'react';
import { TrendData, SortConfig, SortableKeys } from './types';
import { fetchTrendingProducts } from './services/geminiService';
import { COUNTRIES, CATEGORIES, TIME_RANGES } from './constants';
import Header from './components/Header';
import Filters from './components/Filters';
import ResultsTable from './components/ResultsTable';
import Sources from './components/Sources';
import Insight from './components/Insight';

const App: React.FC = () => {
  const [country, setCountry] = useState<string>(COUNTRIES[0].code);
  const [category, setCategory] = useState<string>(CATEGORIES[0].code);
  const [timeRange, setTimeRange] = useState<string>(TIME_RANGES[0].code);
  const [trendData, setTrendData] = useState<TrendData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTimeRangeName, setCurrentTimeRangeName] = useState<string>(TIME_RANGES[0].name);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'rank', direction: 'ascending' });

  const handleFindTrends = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setTrendData(null);
    setSortConfig({ key: 'rank', direction: 'ascending' }); // Reset sort on new search
    
    // Client-side caching using sessionStorage
    const cacheKey = JSON.stringify({ country, category, timeRange });
    try {
      const cachedData = sessionStorage.getItem(cacheKey);
      if (cachedData) {
        const parsedData = JSON.parse(cachedData) as TrendData;
        const timeRangeName = TIME_RANGES.find(t => t.code === timeRange)?.name || 'Past 12 Months';
        setCurrentTimeRangeName(timeRangeName);
        setTrendData(parsedData);
        setIsLoading(false);
        return;
      }
    } catch (e) {
      console.error("Failed to read from sessionStorage", e);
      sessionStorage.removeItem(cacheKey); // Clear corrupted cache
    }

    try {
      const countryName = COUNTRIES.find(c => c.code === country)?.name || 'the selected country';
      const categoryName = CATEGORIES.find(c => c.code === category)?.name || 'All Categories';
      const timeRangeName = TIME_RANGES.find(t => t.code === timeRange)?.name || 'Past 12 Months';
      
      setCurrentTimeRangeName(timeRangeName);
      const data = await fetchTrendingProducts(countryName, categoryName, timeRangeName);
      
      try {
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
      } catch (e) {
        console.error("Failed to save to sessionStorage", e);
      }

      setTrendData(data);
    } catch (err) {
      setError('Failed to fetch trending products. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [country, category, timeRange]);

  const handleSort = (key: SortableKeys) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
        direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedProducts = useMemo(() => {
    if (!trendData?.products) return [];
    const sortableItems = [...trendData.products];
    if (sortConfig.key) {
        sortableItems.sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortConfig.direction === 'ascending' 
                    ? aValue.localeCompare(bValue) 
                    : bValue.localeCompare(aValue);
            }
            
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortConfig.direction === 'ascending' 
                    ? aValue - bValue 
                    : bValue - aValue;
            }
            
            return 0;
        });
    }
    return sortableItems;
  }, [trendData?.products, sortConfig]);


  return (
    <div className="min-h-screen bg-white text-black font-serif">
      <main className="p-4 md:p-8">
        <Header />
        <div className="mt-8">
          <Filters
            country={country}
            setCountry={setCountry}
            category={category}
            setCategory={setCategory}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            onFind={handleFindTrends}
            isLoading={isLoading}
          />

          { !isLoading && !error && trendData?.insight && (
            <Insight insight={trendData.insight} />
          )}

          <div className="mt-8 border-2 border-black">
            {isLoading && (
              <div className="flex flex-col items-center justify-center p-16 text-center">
                <h3 className="text-4xl font-mono animate-pulse">THINKING...</h3>
              </div>
            )}

            {error && (
              <div className="p-16 text-center text-red-600 font-mono">
                <h3 className="text-2xl font-bold">ERROR</h3>
                <p>{error}</p>
              </div>
            )}

            {!isLoading && !error && trendData && sortedProducts.length > 0 && (
              <ResultsTable 
                results={sortedProducts} 
                timeRangeName={currentTimeRangeName} 
                sortConfig={sortConfig}
                onSort={handleSort}
              />
            )}

            {!isLoading && !error && trendData && trendData.products.length === 0 && (
              <div className="p-16 text-center font-mono">
                <h3 className="text-2xl">NO RESULTS FOUND</h3>
                <p>Try different filters.</p>
              </div>
            )}

            {!isLoading && !error && !trendData && (
              <div className="p-16 text-center font-mono">
                <h3 className="text-2xl">SELECT FILTERS AND CLICK FIND</h3>
              </div>
            )}
          </div>

          {!isLoading && !error && trendData && trendData.sources && trendData.sources.length > 0 && (
            <Sources sources={trendData.sources} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;