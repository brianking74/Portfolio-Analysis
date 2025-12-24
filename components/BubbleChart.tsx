
import React from 'react';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  ReferenceLine,
  Label
} from 'recharts';
import { ProcessedPrincipalData, CREDIT_ORDER, BARRIER_COLORS, BARRIER_LABELS } from '../types';

interface BubbleChartProps {
  data: ProcessedPrincipalData[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ProcessedPrincipalData;
    return (
      <div className="bg-white p-4 border rounded shadow-lg">
        <p className="font-bold text-gray-800 border-b pb-1 mb-2">{data.name}</p>
        <p className="text-sm"><span className="text-gray-500">Margin:</span> {data.margin}%</p>
        <p className="text-sm"><span className="text-gray-500">Revenue:</span> ${data.revenue.toLocaleString()}</p>
        <p className="text-sm"><span className="text-gray-500">Credit Terms:</span> {data.creditTerms}</p>
        <p className="text-sm">
          <span className="text-gray-500">Barrier:</span>{' '}
          <span style={{ color: BARRIER_COLORS[data.barrier] }}>{BARRIER_LABELS[data.barrier]}</span>
        </p>
      </div>
    );
  }
  return null;
};

const BubbleChart: React.FC<BubbleChartProps> = ({ data }) => {
  // Calculate average margin for the quadrant divider
  const avgMargin = 50; // Using 50% as a strategic benchmark or can be dynamic
  const medianX = Math.floor(CREDIT_ORDER.length / 2);

  return (
    <div className="w-full h-[600px] bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden">
      {/* Quadrant Labels */}
      <div className="absolute top-8 left-16 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">High Margin / Short Terms</div>
      <div className="absolute top-8 right-16 text-[10px] font-semibold text-slate-400 uppercase tracking-widest text-right">High Margin / Hard Terms</div>
      <div className="absolute bottom-16 left-16 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Low Margin / Short Terms</div>
      <div className="absolute bottom-16 right-16 text-[10px] font-semibold text-slate-400 uppercase tracking-widest text-right">Low Margin / Hard Terms</div>

      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 20 }}>
          <XAxis 
            type="number" 
            dataKey="xAxisValue" 
            name="Credit Terms" 
            domain={[0, CREDIT_ORDER.length - 1]}
            ticks={CREDIT_ORDER.map((_, i) => i)}
            tickFormatter={(val) => CREDIT_ORDER[val]}
            stroke="#94a3b8"
            fontSize={12}
          >
            <Label value="Credit Terms (Increasing Resistance →)" offset={-20} position="insideBottom" fill="#64748b" />
          </XAxis>
          <YAxis 
            type="number" 
            dataKey="margin" 
            name="Margin" 
            unit="%" 
            domain={[0, 100]}
            stroke="#94a3b8"
            fontSize={12}
          >
            <Label value="Margin %" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} fill="#64748b" />
          </YAxis>
          <ZAxis 
            type="number" 
            dataKey="bubbleSize" 
            range={[100, 4000]} 
            name="Revenue" 
          />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
          
          {/* Quadrant Lines */}
          <ReferenceLine x={medianX} stroke="#e2e8f0" strokeWidth={2} />
          <ReferenceLine y={avgMargin} stroke="#e2e8f0" strokeWidth={2} />

          <Scatter name="Principals" data={data}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={BARRIER_COLORS[entry.barrier]} 
                fillOpacity={0.7}
                stroke={BARRIER_COLORS[entry.barrier]}
                strokeWidth={1}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BubbleChart;
