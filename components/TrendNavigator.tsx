
import React from 'react';
import { ProductTrend } from '../types';

interface TrendNavigatorProps {
  products: ProductTrend[];
  selectedTrend: ProductTrend | null;
  onSelect: (product: ProductTrend) => void;
}

const TrendNavigator: React.FC<TrendNavigatorProps> = ({ products, selectedTrend, onSelect }) => {
  return (
    <nav className="h-full max-h-96 md:max-h-full overflow-y-auto">
      <h2 className="text-sm font-mono uppercase tracking-widest text-gray-400 p-3 bg-gray-800 border-b border-gray-700 sticky top-0">
        Top {products.length} Trends
      </h2>
      <ul>
        {products.map((product) => (
          <li key={product.rank}>
            <button
              onClick={() => onSelect(product)}
              className={`w-full text-left p-3 flex items-start gap-3 transition-colors duration-150 border-b border-gray-700 ${
                product.rank === selectedTrend?.rank
                  ? 'bg-lime-400/10'
                  : 'hover:bg-gray-800'
              }`}
            >
              <span
                className={`text-xl font-bold font-mono mt-0.5 ${
                  product.rank === selectedTrend?.rank
                    ? 'text-lime-400'
                    : 'text-gray-500'
                }`}
              >
                {product.rank}
              </span>
              <div className="flex-1">
                <span
                  className={`font-bold text-base ${
                    product.rank === selectedTrend?.rank
                      ? 'text-white'
                      : 'text-gray-300'
                  }`}
                >
                  {product.productName}
                </span>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono text-gray-400">Score: {product.trendScore}</span>
                    <div className="w-full max-w-20 h-1 bg-gray-700 rounded-full">
                        <div className="h-1 bg-lime-400 rounded-full" style={{ width: `${product.trendScore}%` }}></div>
                    </div>
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TrendNavigator;