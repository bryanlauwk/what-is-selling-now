

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { TrendData, SortConfig, SortableKeys, ProductTrend } from './types';
import { fetchTrendingProducts } from './services/geminiService';
import { COUNTRIES, CATEGORIES, TIME_RANGES, LIST_SIZES } from './constants';
import Header from './components/Header';
import Filters from './components/Filters';
import ResultsTable from './components/ResultsTable';
import Sources from './components/Sources';
import { ShareIcon, CloseIcon } from './components/icons';

// --- Start of ShareModal Component ---
interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  htmlContent: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, htmlContent }) => {
  const [copyButtonText, setCopyButtonText] = useState('Copy HTML');

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(htmlContent);
      setCopyButtonText('Copied!');
      setTimeout(() => setCopyButtonText('Copy HTML'), 2000);
    // Fix: Added braces to the catch block to fix a syntax error.
    } catch (err) {
      console.error('Failed to copy HTML: ', err);
      setCopyButtonText('Failed to copy');
      setTimeout(() => setCopyButtonText('Copy HTML'), 2000);
    }
  }, [htmlContent]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
    >
      <div 
        className="bg-gray-900 border border-gray-700 w-full max-w-5xl max-h-[90vh] flex flex-col rounded-none"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
          <h2 id="share-modal-title" className="text-xl font-bold font-mono text-lime-400">Embed & Share Results</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close modal">
              <CloseIcon className="h-6 w-6" />
          </button>
        </header>

        <main className="flex-grow overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-0">
          <div className="p-4 flex flex-col h-full overflow-y-auto border-r-0 lg:border-r border-gray-700">
            <h3 className="text-lg font-bold font-mono mb-2 flex-shrink-0">HTML Code</h3>
            <p className="text-sm text-gray-400 mb-2 font-mono flex-shrink-0">Copy this code and paste it into your website's HTML editor.</p>
            <textarea
              readOnly
              className="w-full flex-grow bg-black border border-gray-600 text-gray-300 font-mono text-xs p-2 focus:outline-none focus:border-lime-400 resize-none"
              value={htmlContent}
              aria-label="Embeddable HTML code"
            />
            <button
              onClick={handleCopy}
              className="mt-4 w-full px-4 py-2 border border-lime-400 text-base font-bold rounded-none text-black bg-lime-400 hover:bg-lime-300 flex-shrink-0"
            >
              {copyButtonText}
            </button>
          </div>
          <div className="p-4 flex flex-col h-full overflow-y-auto">
            <h3 className="text-lg font-bold font-mono mb-2 flex-shrink-0">Live Preview</h3>
             <div className="w-full flex-grow border border-gray-600 p-2 overflow-auto">
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </div>
          </div>
        </main>
        
        <footer className="p-4 border-t border-gray-700 text-right flex-shrink-0">
          <button 
            onClick={onClose} 
            className="px-4 py-2 border border-gray-500 text-sm font-bold rounded-none text-gray-300 bg-transparent hover:bg-gray-800"
          >
            Close
          </button>
        </footer>
      </div>
    </div>
  );
};
// --- End of ShareModal Component ---


const App: React.FC = () => {
  const [country, setCountry] = useState<string>(COUNTRIES[0].code);
  const [category, setCategory] = useState<string>(CATEGORIES[0].code);
  const [timeRange, setTimeRange] = useState<string>(TIME_RANGES[0].code);
  const [listSize, setListSize] = useState<number>(LIST_SIZES[1].value); // Default to 20
  const [trendData, setTrendData] = useState<TrendData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTimeRangeName, setCurrentTimeRangeName] = useState<string>(TIME_RANGES[0].name);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'rank', direction: 'ascending' });
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareableHtml, setShareableHtml] = useState('');

  // On initial load, read parameters from URL hash and set state.
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const countryParam = hashParams.get('country');
    const categoryParam = hashParams.get('category');
    const timeRangeParam = hashParams.get('timeRange');
    const listSizeParam = hashParams.get('listSize');

    if (countryParam && COUNTRIES.some(c => c.code === countryParam)) {
        setCountry(countryParam);
    }
    if (categoryParam && CATEGORIES.some(c => c.code === categoryParam)) {
        setCategory(categoryParam);
    }
    if (timeRangeParam && TIME_RANGES.some(t => t.code === timeRangeParam)) {
        setTimeRange(timeRangeParam);
    }
    if (listSizeParam && LIST_SIZES.some(s => s.value === Number(listSizeParam))) {
        setListSize(Number(listSizeParam));
    }
  }, []);
  
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
    setSortConfig({ key: 'rank', direction: 'ascending' });
    
    const cacheKey = JSON.stringify({ country, category, timeRange, listSize });
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
      sessionStorage.removeItem(cacheKey);
    }

    try {
      const countryName = COUNTRIES.find(c => c.code === country)?.name || 'the selected country';
      const categoryName = CATEGORIES.find(c => c.code === category)?.name || 'All Categories';
      const timeRangeName = TIME_RANGES.find(t => t.code === timeRange)?.name || 'Past 12 Months';
      
      setCurrentTimeRangeName(timeRangeName);
      const data = await fetchTrendingProducts(countryName, categoryName, timeRangeName, listSize);
      
      setTrendData(data);
      
      try {
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
      } catch (e) {
        console.error("Failed to save to sessionStorage", e);
      }
      
      const hashParams = new URLSearchParams();
      hashParams.set('country', country);
      hashParams.set('category', category);
      hashParams.set('timeRange', timeRange);
      hashParams.set('listSize', String(listSize));
      window.location.hash = hashParams.toString();

    } catch (err) {
      // Fix: Correctly escape the single quote in the error message string.
      setError('We couldn\'t retrieve trend data. Please try different filters or check your connection.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [country, category, timeRange, listSize]);

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
            const aValue = a[sortConfig.key as keyof typeof a];
            const bValue = b[sortConfig.key as keyof typeof b];

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

  const generateHtmlForTable = useCallback((products: ProductTrend[]): string => {
    const countryName = COUNTRIES.find(c => c.code === country)?.name || country;
    const categoryName = CATEGORIES.find(c => c.code === category)?.name || category;
    const timeRangeName = TIME_RANGES.find(t => t.code === timeRange)?.name || currentTimeRangeName;

    const styles = {
        container: `font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #111827; color: #f3f4f6; padding: 20px; border-radius: 8px;`,
        header: `font-size: 24px; font-weight: bold; color: #bef264; margin-bottom: 10px;`,
        subHeader: `font-size: 16px; color: #9ca3af; margin-bottom: 20px;`,
        table: `width: 100%; border-collapse: collapse;`,
        th: `border: 1px solid #4b5563; padding: 12px; text-align: left; background-color: #1f2937; color: #d1d5db; text-transform: uppercase; font-size: 12px; letter-spacing: 0.05em;`,
        td: `border: 1px solid #4b5563; padding: 12px; vertical-align: top; font-size: 14px;`,
        rank: `font-size: 20px; font-weight: bold; text-align: center;`,
        productName: `font-weight: bold; color: #ffffff;`,
        googleLink: `color: #9ca3af; text-decoration: none; font-size: 12px; display: block; margin-top: 4px;`,
        keyword: `color: #d1d5db;`,
        growth: `font-weight: bold;`,
        green: `color: #4ade80;`,
        supplier: `display: inline-block; background-color: #374151; border: 1px solid #4b5563; color: #d1d5db; padding: 2px 8px; border-radius: 4px; font-size: 12px; margin: 2px;`,
        footer: `margin-top: 20px; font-size: 12px; color: #6b7280; text-align: center;`
    };

    const tableHeader = `
        <thead>
            <tr>
                <th style="${styles.th}">Rank</th>
                <th style="${styles.th}">Product</th>
                <th style="${styles.th}">Trend Score</th>
                <th style="${styles.th}">Breakout Keywords</th>
                <th style="${styles.th}">Suppliers</th>
            </tr>
        </thead>
    `;

    const tableBody = products.map(item => `
        <tr>
            <td style="${styles.td}"><div style="${styles.rank}">${item.rank}</div></td>
            <td style="${styles.td}">
                <div style="${styles.productName}">${item.productName}</div>
            </td>
            <td style="${styles.td}"><div style="font-weight: bold; text-align: center;">${item.trendScore}</div></td>
            <td style="${styles.td}">
                ${item.breakoutKeywords?.map(bk => `
                    <div>
                        <span style="${styles.keyword}">${bk.keyword}</span>
                        <span style="${styles.growth} ${bk.growth > 0 ? styles.green : ''}">(${bk.growth > 0 ? '+' : ''}${bk.growth}%)</span>
                    </div>
                `).join('') || 'N/A'}
            </td>
            <td style="${styles.td}">
                ${item.suppliers?.map(s => `<span style="${styles.supplier}">${s}</span>`).join('') || 'N/A'}
            </td>
        </tr>
    `).join('');

    return `
        <div style="${styles.container}">
            <h2 style="${styles.header}">What's Selling Now? - Trending Products</h2>
            <p style="${styles.subHeader}">Top ${products.length} trends for <strong>${categoryName}</strong> in <strong>${countryName}</strong> (${timeRangeName})</p>
            <table style="${styles.table}">
                ${tableHeader}
                <tbody>
                    ${tableBody}
                </tbody>
            </table>
            <div style="${styles.footer}">
                Generated by "What's Selling Now?" | Data Source: Google Trends
            </div>
        </div>
    `;
  }, [country, category, timeRange, currentTimeRangeName]);

  const handleShare = useCallback(async () => {
    if (!sortedProducts || sortedProducts.length === 0) return;
    const html = generateHtmlForTable(sortedProducts);
    setShareableHtml(html);
    setIsShareModalOpen(true);
  }, [sortedProducts, generateHtmlForTable]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
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
            listSize={listSize}
            setListSize={setListSize}
            onFind={handleFindTrends}
            isLoading={isLoading}
          />

          {!isLoading && !error && trendData && (
            <div className="mt-4 flex justify-end items-center gap-4">
                <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-500 text-sm font-bold rounded-none text-gray-300 bg-transparent hover:bg-gray-800 disabled:opacity-50"
                    aria-label="Share results"
                    disabled={!trendData || trendData.products.length === 0}
                >
                    <ShareIcon className="h-4 w-4" />
                    SHARE
                </button>
            </div>
          )}

          <div className="mt-2 border border-gray-700">
            {isLoading && (
              <div className="flex flex-col items-center justify-center p-16 text-center">
                <h3 className="text-4xl font-mono animate-pulse text-lime-400">GATHERING INSIGHTS...</h3>
              </div>
            )}

            {error && (
              <div className="p-16 text-center text-red-400 font-mono">
                <h3 className="text-2xl font-bold">REQUEST FAILED</h3>
                <p>{error}</p>
              </div>
            )}

            {!isLoading && !error && trendData && sortedProducts.length > 0 && (
              <ResultsTable 
                results={sortedProducts} 
                timeRangeName={currentTimeRangeName} 
                sortConfig={sortConfig}
                onSort={handleSort}
                country={country}
              />
            )}

            {!isLoading && !error && trendData && trendData.products.length === 0 && (
              <div className="p-16 text-center font-mono">
                <h3 className="text-2xl">NO RESULTS FOUND</h3>
                <p className="text-gray-400">Try different filters.</p>
              </div>
            )}

            {!isLoading && !error && !trendData && (
              <div className="p-16 text-center font-mono">
                <h3 className="text-2xl">SELECT YOUR CRITERIA TO UNCOVER THE NEXT BIG THING.</h3>
              </div>
            )}
          </div>
          
          {!isLoading && !error && trendData && (
            <Sources sources={trendData.sources} />
          )}
        </div>
      </main>
      <ShareModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        htmlContent={shareableHtml}
      />
    </div>
  );
};

export default App;