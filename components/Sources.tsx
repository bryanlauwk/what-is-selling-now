
import React from 'react';
import { GroundingChunk } from '../types';

interface SourcesProps {
  sources: GroundingChunk[];
}

const Sources: React.FC<SourcesProps> = ({ sources }) => {
  const hasSources = sources && sources.length > 0;

  return (
    <div className="mt-8 p-4 border border-gray-500">
      <h3 className="text-lg font-bold font-mono text-lime-400 mb-3 uppercase tracking-widest">Data & Methodology</h3>
      <p className="text-gray-400 font-mono text-sm mb-4">
        This analysis is grounded in real-time Google Search data to ensure accuracy and relevance. The AI identifies trending products by examining search interest patterns from Google Trends and validates its findings against sources like the ones listed below.
      </p>
      {hasSources ? (
        <ul className="space-y-1">
          {sources.map((source, index) => (
            source.web && (
              <li key={index} className="text-sm text-gray-400 truncate font-mono">
                <a
                  href={source.web.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={source.web.title || source.web.uri}
                  className="text-gray-300 hover:text-lime-400 hover:underline"
                >
                  {source.web.title || source.web.uri}
                </a>
              </li>
            )
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 font-mono text-sm italic">No specific external articles were cited for this analysis.</p>
      )}
    </div>
  );
};

export default Sources;