
import { RawPrincipalData, ProcessedPrincipalData, CREDIT_ORDER, BarrierType } from '../types';

export const parseCSVData = (csv: string): RawPrincipalData[] => {
  const lines = csv.trim().split('\n');
  // Skip header
  const dataLines = lines.slice(1);

  return dataLines.map(line => {
    // Handling CSV with potential commas inside quoted strings for Revenue
    const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    
    const name = parts[0].trim();
    const margin = parseFloat(parts[1].replace('%', ''));
    const revenue = parseFloat(parts[2].replace(/[$\s,"]/g, ''));
    const creditTerms = parts[3].trim();
    const barrier = parseInt(parts[4].trim()) as BarrierType;

    return { name, margin, revenue, creditTerms, barrier };
  });
};

export const processPrincipalData = (data: RawPrincipalData[]): ProcessedPrincipalData[] => {
  return data.map(item => {
    // Map credit terms to a continuous numeric scale for X-axis
    // Using index of CREDIT_ORDER to ensure requested ordering
    let xAxisValue = CREDIT_ORDER.indexOf(item.creditTerms);
    
    // Fallback for unexpected terms: try to find the closest match or default
    if (xAxisValue === -1) {
      if (item.creditTerms.includes('30')) xAxisValue = 0;
      else if (item.creditTerms.includes('60')) xAxisValue = 3;
      else if (item.creditTerms.includes('90')) xAxisValue = 5;
      else xAxisValue = 5; // Default middle
    }

    return {
      ...item,
      xAxisValue,
      bubbleSize: item.revenue
    };
  });
};
