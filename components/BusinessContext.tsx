
import React from 'react';

interface BusinessContextProps {
  description: string;
  setDescription: (description: string) => void;
  isLoading: boolean;
}

const BusinessContext: React.FC<BusinessContextProps> = ({ description, setDescription, isLoading }) => {
  return (
    <div className="p-4 border border-dashed border-gray-500">
      <h2 className="text-xl font-bold font-mono text-lime-400 mb-2">Tell Me About Your Product or Service</h2>
      <p className="text-sm text-gray-400 font-mono mb-4">
        Got a business or a product idea? Let us know! We'll tailor the trend analysis and provide strategic insights just for you.
      </p>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={isLoading}
        placeholder="e.g., 'I run an online store selling sustainable, handmade pet toys' or 'I'm planning to launch a brand of vegan protein snacks.'"
        className="w-full h-24 bg-black border border-gray-500 rounded-none p-2 focus:outline-none focus:border-lime-400 text-white font-mono text-sm resize-y"
        aria-label="Business description"
      />
    </div>
  );
};

export default BusinessContext;