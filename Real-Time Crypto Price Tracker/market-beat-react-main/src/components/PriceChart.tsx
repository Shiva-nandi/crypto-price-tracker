
import React from 'react';
import { cn } from '@/lib/utils';

interface PriceChartProps {
  data: number[];
  percentChange: number;
  height?: number;
}

const PriceChart: React.FC<PriceChartProps> = ({ 
  data, 
  percentChange,
  height = 40 
}) => {
  // Ensure there is data to display
  if (!data || data.length < 2) {
    return <div className="h-10 flex items-center justify-center text-gray-400">No data</div>;
  }

  // Calculate dimensions
  const width = 100;
  
  // Find min and max for scaling
  const min = Math.min(...data);
  const max = Math.max(...data);
  
  // Calculate the vertical scale factor (with padding)
  const verticalPadding = 0.1; // 10% padding top and bottom
  const verticalRange = max - min;
  const paddedMin = min - (verticalRange * verticalPadding);
  const paddedMax = max + (verticalRange * verticalPadding);
  const effectiveVerticalRange = paddedMax - paddedMin;
  
  // Create points for the path
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - paddedMin) / effectiveVerticalRange) * height;
    return `${x},${y}`;
  }).join(' ');

  // Determine color based on percent change
  const isPositive = percentChange >= 0;
  const chartColor = isPositive ? "#4CAF50" : "#FF4D4F";

  return (
    <svg 
      width={width} 
      height={height} 
      className={cn("overflow-visible", isPositive ? "text-positive" : "text-negative")}
    >
      <polyline
        points={points}
        fill="none"
        stroke={chartColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default PriceChart;
