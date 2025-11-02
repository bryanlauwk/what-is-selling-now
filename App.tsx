

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { TrendData } from './types';
import { fetchTrendingProducts } from './services/geminiService';
import { COUNTRIES, CATEGORIES, TIME_RANGES, LOADING_MESSAGES } from './constants';
import Header from './components/Header';
import Filters from './components/Filters';
import TrendWorkspace from './components/TrendWorkspace';
import BusinessContext from './components/BusinessContext';

const App: React.FC = () => {
  const [country, setCountry] = useState<string>(COUNTRIES[0].code);
  const [category, setCategory] = useState<string>(CATEGORIES[0].code);
  const [timeRange, setTimeRange] = useState<string>(TIME_RANGES[0].code);
  const [businessDescription, setBusinessDescription] = useState<string>('');
  
  const [trendData, setTrendData] = useState<TrendData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isShowingResults, setIsShowingResults] = useState<boolean>(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);


  // On initial load, read parameters from URL hash and set state.
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const countryParam = hashParams.get('country');
    const categoryParam = hashParams.get('category');
    const businessDescParam = hashParams.get('businessDescription');

    const isCategoryValid = (code: string): boolean => {
      for (const item of CATEGORIES) {
        if ('options' in item && item.options) { // It's a group
          if (item.options.some(opt => opt.code === code)) return true;
        } else { // It's a single option
          if (item.code === code) return true;
        }
      }
      return false;
    };

    if (countryParam && COUNTRIES.some(c => c.code === countryParam)) {
        setCountry(countryParam);
    }
    if (categoryParam && isCategoryValid(categoryParam)) {
        setCategory(categoryParam);
    }
    if (businessDescParam) {
        setBusinessDescription(decodeURIComponent(businessDescParam));
    }
  }, []);
  
  // Effect to cycle through loading messages
  useEffect(() => {
    // Fix: Use ReturnType<typeof setInterval> instead of NodeJS.Timeout for browser compatibility.
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isLoading) {
      setLoadingMessageIndex(0); // Reset on new load
      interval = setInterval(() => {
        setLoadingMessageIndex(prevIndex => (prevIndex + 1) % LOADING_MESSAGES.length);
      }, 2500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);

  const handleFindTrends = useCallback(async () => {
    // --- START: Rate Limiting Logic ---
    const USAGE_LIMIT = 5;
    const USAGE_KEY = 'trendFinderApiUsage';
    const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

    try {
        const now = Date.now();
        let usage = { count: 0, lastReset: now };
        const storedUsage = localStorage.getItem(USAGE_KEY);

        if (storedUsage) {
            try {
                const parsedUsage = JSON.parse(storedUsage);
                if (typeof parsedUsage.count === 'number' && typeof parsedUsage.lastReset === 'number') {
                    usage = parsedUsage;
                }
            } catch (e) {
                console.warn('Malformed usage data in localStorage, resetting.', e);
                usage = { count: 0, lastReset: now };
            }
        }

        if (now - usage.lastReset > TWENTY_FOUR_HOURS_MS) {
            usage = { count: 0, lastReset: now };
        }

        if (usage.count >= USAGE_LIMIT) {
            const resetTime = new Date(usage.lastReset + TWENTY_FOUR_HOURS_MS);
            setError(`Daily search limit (${USAGE_LIMIT}) reached. Please try again after ${resetTime.toLocaleString()}.`);
            setIsLoading(false);
            return;
        }
        
        usage.count += 1;
        localStorage.setItem(USAGE_KEY, JSON.stringify(usage));

    } catch (e) {
        console.error("Could not access localStorage. Rate limiting is disabled.", e);
    }
    // --- END: Rate Limiting Logic ---

    setIsLoading(true);
    setError(null);
    setTrendData(null);
    setIsShowingResults(false);
    
    const cacheKey = JSON.stringify({ country, category, timeRange, businessDescription });
    try {
      const cachedData = sessionStorage.getItem(cacheKey);
      if (cachedData) {
        const parsedData = JSON.parse(cachedData) as TrendData;
        setTrendData(parsedData);
        setIsShowingResults(true);
        setIsLoading(false);
        return;
      }
    } catch (e) {
      console.error("Failed to read from sessionStorage", e);
      sessionStorage.removeItem(cacheKey);
    }

    try {
      const findCategoryName = (code: string): string => {
        for (const item of CATEGORIES) {
          if ('options' in item && item.options) { // It's a group
            const foundOption = item.options.find(opt => opt.code === code);
            if (foundOption) return foundOption.name;
          } else { // It's a single option
            if (item.code === code) return item.name;
          }
        }
        return 'All Categories'; // Default fallback
      };

      const countryName = COUNTRIES.find(c => c.code === country)?.name || 'the selected country';
      const categoryName = findCategoryName(category);
      const timeRangeName = TIME_RANGES.find(t => t.code === timeRange)?.name || 'Past 90 Days';
      
      const data = await fetchTrendingProducts(countryName, categoryName, timeRangeName, businessDescription);
      
      setTrendData(data);
      setIsShowingResults(true);
      
      try {
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
      } catch (e) {
        console.error("Failed to save to sessionStorage", e);
      }
      
      const hashParams = new URLSearchParams();
      hashParams.set('country', country);
      hashParams.set('category', category);
      if (businessDescription.trim()) {
        hashParams.set('businessDescription', encodeURIComponent(businessDescription));
      }
      window.location.hash = hashParams.toString();

    } catch (err) {
      setError('We couldn\'t retrieve trend data. Please try different filters or check your connection.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [country, category, timeRange, businessDescription]);

  const handleClearFilters = useCallback(() => {
    setCountry(COUNTRIES[0].code);
    setCategory(CATEGORIES[0].code);
    setBusinessDescription('');
    setTrendData(null);
    setError(null);
    setIsShowingResults(false);
    window.location.hash = '';
  }, []);

  const handleBackToFilters = useCallback(() => {
    setIsShowingResults(false);
  }, []);

  const renderContent = () => {
    if (isShowingResults && trendData) {
      return (
        <TrendWorkspace 
          trendData={trendData}
          onBack={handleBackToFilters}
          country={country}
        />
      );
    }

    return (
      <>
        <div className="border border-gray-700">
          <BusinessContext
            description={businessDescription}
            setDescription={setBusinessDescription}
            isLoading={isLoading}
          />
          <Filters
            country={country}
            setCountry={setCountry}
            category={category}
            setCategory={setCategory}
            onFind={handleFindTrends}
            onClear={handleClearFilters}
            isLoading={isLoading}
          />
        </div>
        <div className="mt-8 border border-gray-700">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-16 text-center">
              <h3 className="text-4xl font-mono animate-pulse text-lime-400 transition-all duration-500">
                {LOADING_MESSAGES[loadingMessageIndex]}...
              </h3>
            </div>
          ) : error ? (
            <div className="p-16 text-center text-red-400 font-mono">
              <h3 className="text-2xl font-bold">REQUEST FAILED</h3>
              <p>{error}</p>
            </div>
          ) : (
            <div className="p-16 text-center font-mono">
              <h3 className="text-2xl">SELECT YOUR CRITERIA TO UNCOVER THE NEXT BIG THING.</h3>
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <main className="p-4 md:p-8">
        <Header />
        <div className="mt-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
