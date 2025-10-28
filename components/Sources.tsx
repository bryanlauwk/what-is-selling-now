import React from 'react';
import { GroundingChunk } from '../types';

interface SourcesProps {
  sources: GroundingChunk[];
}

const Sources: React.FC<SourcesProps> = ({ sources }) => {
  if (!sources || sources.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 p-4 border-2 border-black">
      <h3 className="text-xl font-bold font-mono text-black mb-2">DATA SOURCES</h3>
      <ul className="list-disc list-inside space-y-1">
        {sources.map((source, index) => (
          source.web && (
            <li key={index} className="text-sm text-black truncate font-mono">
              <a
                href={source.web.uri}
                target="_blank"
                rel="noopener noreferrer"
                title={source.web.title || source.web.uri}
                className="text-blue-700 hover:text-red-700 underline"
              >
                {source.web.title || source.web.uri}
              </a>
            </li>
          )
        ))}
      </ul>
    </div>
  );
};

export default Sources;