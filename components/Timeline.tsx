import React from 'react';
import { TimelineEvent } from '../types';

interface TimelineProps {
  events: TimelineEvent[];
}

const Timeline: React.FC<TimelineProps> = ({ events }) => {
  return (
    <div className="space-y-4 font-mono text-sm">
      <div className="flex items-center space-x-2 text-arch-accent mb-4 border-b border-arch-panel pb-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="uppercase tracking-wider font-bold">Temporal Analysis</h3>
      </div>

      <div className="relative border-l border-gray-700 ml-3">
        {events.map((event, idx) => (
          <div key={idx} className="mb-6 ml-6 relative group">
            <span className={`absolute -left-[31px] flex h-4 w-4 items-center justify-center rounded-full ${event.isError ? 'bg-arch-error animate-pulse' : 'bg-gray-600 group-hover:bg-arch-accent'} ring-4 ring-arch-bg`}>
            </span>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                <span className="text-xs text-gray-500 font-bold tracking-widest">{event.timestamp}</span>
                {event.isError && <span className="text-xs bg-red-900 text-red-200 px-2 py-0.5 rounded uppercase tracking-wider">Detection</span>}
            </div>
            <div className="mt-1 p-3 bg-arch-panel rounded border border-gray-700 hover:border-arch-accent transition-colors">
              <p className="text-white font-semibold mb-1">{event.action}</p>
              <p className="text-gray-400 text-xs">{event.observation}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
