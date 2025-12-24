
import React from 'react';
import { RawPrincipalData, BARRIER_COLORS, BARRIER_LABELS } from '../types.ts';

interface PrincipalTableProps {
  data: RawPrincipalData[];
}

const PrincipalTable: React.FC<PrincipalTableProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Principal</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Margin</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Revenue</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Credit Terms</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Barrier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((principal, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-800">{principal.name}</td>
                <td className="px-6 py-4 text-slate-600">{principal.margin}%</td>
                <td className="px-6 py-4 text-slate-800 font-mono text-right font-semibold">
                  ${principal.revenue.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-slate-600">{principal.creditTerms}</td>
                <td className="px-6 py-4">
                  <span 
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={{ backgroundColor: `${BARRIER_COLORS[principal.barrier]}20`, color: BARRIER_COLORS[principal.barrier] }}
                  >
                    {BARRIER_LABELS[principal.barrier]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PrincipalTable;
