import React from 'react';

interface InsightProps {
  insight: string;
}

const Insight: React.FC<InsightProps> = ({ insight }) => {
  return (
    <div className="mt-8 p-4 bg-black text-white border-2 border-black">
      <p className="text-lg md:text-xl font-mono text-center">
        <span className="font-bold uppercase tracking-widest mr-2">Market Insight:</span>
        {insight}
      </p>
    </div>
  );
};

export default Insight;