

import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from './icons';

interface BusinessContextProps {
  description: string;
  setDescription: (description: string) => void;
  isLoading: boolean;
}

const BusinessContext: React.FC<BusinessContextProps> = ({ description, setDescription, isLoading }) => {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <div className="p-4 border-b border-gray-700 bg-gray-800/30">
      <div className="flex justify-between items-center mb-2">
        <div>
            <h2 className="text-xl font-bold font-mono text-lime-400">Personalize Your Analysis (Optional)</h2>
            <p className="text-sm text-gray-400 font-mono">Provide context about your business for tailored insights.</p>
        </div>
        <button
          onClick={() => setShowGuide(!showGuide)}
          className="flex items-center gap-1 text-sm font-mono text-gray-400 hover:text-white"
          aria-expanded={showGuide}
        >
          {showGuide ? 'Hide Guide' : 'View Writing Guide'}
          {showGuide ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
        </button>
      </div>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={isLoading}
        placeholder='e.g., "We sell premium, eco-friendly yoga mats online targeting environmentally conscious millennials..."'
        className="w-full h-20 bg-black border border-gray-500 rounded-none p-2 focus:outline-none focus:border-lime-400 text-white font-mono text-sm resize-y"
        aria-label="Business description"
      />
      
      {showGuide && (
         <div className="mt-4 p-3 bg-gray-800/50 border-l-4 border-lime-400 animate-[fadeIn_0.3s_ease-out]">
            <h4 className="font-bold font-mono text-sm text-gray-300">For the best results, tell us about:</h4>
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-gray-400 font-mono">
              <li>Your <span className="text-lime-400">star product</span> & its unique selling proposition (USP).</li>
              <li>Your <span className="text-lime-400">target customer</span> or ideal persona.</li>
              <li>Your primary <span className="text-lime-400">business goal</span> for this analysis.</li>
            </ul>
            <div className="mt-3 text-sm text-gray-400 font-mono italic">
              <strong>Full Example:</strong> "We sell premium, eco-friendly yoga mats online. Our mats are made from sustainably sourced cork and are extra thick for joint support. We target environmentally conscious millennials and yoga enthusiasts in urban areas. Our goal is to expand into the Southeast Asian market."
            </div>
        </div>
      )}
    </div>
  );
};

export default BusinessContext;