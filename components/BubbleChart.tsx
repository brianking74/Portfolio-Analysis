
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
  Label,
  LabelList
} from 'recharts';
import { ProcessedPrincipalData, CREDIT_ORDER, BARRIER_COLORS, BARRIER_LABELS } from '../types';

interface BubbleChartProps {
  data: ProcessedPrincipalData[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ProcessedPrincipalData;
    return (
      <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-xl ring-1 ring-black ring-opacity-5">
        <p className="font-bold text-slate-900 border-b border-slate-100 pb-1 mb-2">{data.name}</p>
        <div className="space-y-1">
          <p className="text-xs flex justify-between gap-4"><span className="text-slate-500">Margin:</span> <span className="font-semibold">{data.margin}%</span></p>
          <p className="text-xs flex justify-between gap-4"><span className="text-slate-500">Revenue:</span> <span className="font-semibold">${data.revenue.toLocaleString()}</span></p>
          <p className="text-xs flex justify-between gap-4"><span className="text-slate-500">Credit Terms:</span> <span className="font-semibold">{data.creditTerms}</span></p>
          <p className="text-xs flex justify-between gap-4">
            <span className="text-slate-500">Barrier:</span>{' '}
            <span className="font-semibold" style={{ color: BARRIER_COLORS[data.barrier] }}>{BARRIER_LABELS[data.barrier]}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const renderCustomLabel = (props: any) => {
  const { x, y, width, height, value } = props;
  return (
    <text 
      x={x} 
      y={y - 10} 
      fill="#475569" 
      fontSize={9} 
      fontWeight={600}
      textAnchor="middle"
      className="pointer-events-none select-none drop-shadow-sm"
    >
      {value}
    </text>
  );
};

const BubbleChart: React.FC<BubbleChartProps> = ({ data }) => {
  // Using 50% as the strategic median for the quadrant divider
  const avgMargin = 50; 
  const medianX = Math.floor(CREDIT_ORDER.length / 2);

  return (
    <div className="w-full h-[700px] bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
      {/* Quadrant Background Colors */}
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-[0.02] pointer-events-none">
        <div className="bg-emerald-500 border-r border-b border-slate-200"></div>
        <div className="bg-slate-500 border-b border-slate-200"></div>
        <div className="bg-amber-500 border-r border-slate-200"></div>
        <div className="bg-red-500"></div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 40, right: 60, bottom: 40, left: 20 }}>
          <XAxis 
            type="number" 
            dataKey="xAxisValue" 
            name="Credit Terms" 
            domain={[0, CREDIT_ORDER.length - 1]}
            ticks={CREDIT_ORDER.map((_, i) => i)}
            tickFormatter={(val) => CREDIT_ORDER[val]}
            stroke="#cbd5e1"
            fontSize={11}
          >
            <Label value="Credit Terms Hierarchy (Favorable → Restrictive)" offset={-20} position="insideBottom" fill="#94a3b8" fontSize={12} fontWeight={500} />
          </XAxis>
          <YAxis 
            type="number" 
            dataKey="margin" 
            name="Margin" 
            unit="%" 
            domain={[0, 100]}
            stroke="#cbd5e1"
            fontSize={11}
          >
            <Label value="Profit Margin %" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} fill="#94a3b8" fontSize={12} fontWeight={500} />
          </YAxis>
          <ZAxis 
            type="number" 
            dataKey="bubbleSize" 
            range={[400, 5000]} 
            name="Revenue" 
          />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
          
          {/* Main Quadrant Dividers */}
          <ReferenceLine x={medianX} stroke="#e2e8f0" strokeWidth={2} strokeDasharray="5 5" />
          <ReferenceLine y={avgMargin} stroke="#e2e8f0" strokeWidth={2} strokeDasharray="5 5" />

          <Scatter name="Principals" data={data}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={BARRIER_COLORS[entry.barrier]} 
                fillOpacity={0.6}
                stroke={BARRIER_COLORS[entry.barrier]}
                strokeWidth={2}
              />
            ))}
            <LabelList dataKey="name" content={renderCustomLabel} />
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BubbleChart;
