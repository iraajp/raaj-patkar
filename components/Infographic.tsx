
import React from 'react';
import type { Infographic as InfographicType, InfographicDataPoint } from '../types';

const COLORS = ['#6366F1', '#818CF8', '#A5B4FC', '#C7D2FE', '#E0E7FF', '#4F46E5'];

const Legend: React.FC<{ data: InfographicDataPoint[] }> = ({ data }) => (
  <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-8">
    {data.map((item, index) => (
      <div key={index} className="flex items-center gap-2 text-shadow">
        <div
          className="w-4 h-4 rounded"
          style={{ backgroundColor: COLORS[index % COLORS.length] }}
        />
        <span className="font-medium text-gray-200">{item.label} ({item.value}%)</span>
      </div>
    ))}
  </div>
);

const PieChart: React.FC<{ data: InfographicDataPoint[] }> = ({ data }) => {
  const total = data.reduce((acc, item) => acc + item.value, 0);
  let accumulatedPercentage = 0;

  const gradientPoints = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const start = accumulatedPercentage;
    accumulatedPercentage += percentage;
    const end = accumulatedPercentage;
    return `${COLORS[index % COLORS.length]} ${start}% ${end}%`;
  });

  const conicGradient = `conic-gradient(${gradientPoints.join(', ')})`;

  return (
    <div className="flex flex-col items-center">
        <div
            className="w-64 h-64 rounded-full shadow-lg"
            style={{ background: conicGradient }}
        />
        <Legend data={data} />
    </div>
  );
};

const BarChart: React.FC<{ data: InfographicDataPoint[] }> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center">
        <div className="w-full h-80 flex justify-around items-end gap-4 px-4 border-b-2 border-l-2 border-white/20 pb-4">
            {data.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center justify-end h-full group">
                    <div className="w-full relative flex items-end justify-center" style={{ height: `${(item.value / maxValue) * 100}%` }}>
                         <div
                            className="w-3/4 rounded-t-md transition-all duration-300 transform group-hover:scale-105"
                            style={{ 
                                backgroundColor: COLORS[index % COLORS.length],
                                height: '100%',
                                boxShadow: `0 0 15px ${COLORS[index % COLORS.length]}55`
                            }}
                         >
                            <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">{item.value}</span>
                         </div>
                    </div>
                </div>
            ))}
        </div>
         <div className="w-full flex justify-around items-end gap-4 px-4 mt-2">
            {data.map((item, index) => (
                <div key={index} className="flex-1 text-center">
                    <span className="text-gray-300 font-medium text-shadow">{item.label}</span>
                </div>
            ))}
        </div>
    </div>
  );
};

interface InfographicProps {
  infographic: InfographicType;
}

export const Infographic: React.FC<InfographicProps> = ({ infographic }) => {
  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      {infographic.type === 'pie' ? (
        <PieChart data={infographic.data} />
      ) : (
        <BarChart data={infographic.data} />
      )}
    </div>
  );
};
