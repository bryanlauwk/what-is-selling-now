import React from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

interface SparkLineChartProps {
  data: number[];
  color?: string;
}

const SparkLineChart: React.FC<SparkLineChartProps> = ({ data, color = '#000000' }) => {
  const chartData = data.map((value, index) => ({ name: `Point ${index + 1}`, value }));
  const domainMin = Math.min(...data) * 0.95;
  const domainMax = Math.max(...data) * 1.05;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <YAxis domain={[domainMin, domainMax]} hide />
        <Line
          type="linear"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={false}
          isAnimationActive={true}
          animationDuration={800}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SparkLineChart;