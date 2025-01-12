import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

interface Data {
    value: number, 
    label: string
}

interface PieActiveArcProps {
   data: Data[];
}

const PieActiveArc: React.FC<PieActiveArcProps> = ({ data }) => {

  return (
    <PieChart
      series={[
        {
          arcLabel: (item) => `${item.value.toFixed(1)}%`,
          arcLabelMinAngle: 45,
          data,
          highlightScope: { faded: 'global', highlighted: 'item' },
          faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
          innerRadius: 20,
          outerRadius: 150,
          paddingAngle: 5,
          cornerRadius: 5,
          startAngle: -90,
          endAngle: 180,
        },
      ]}    
      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      slotProps={{
        legend: {
          direction: 'column',
          padding: 0,
          position: { vertical: 'bottom', horizontal: 'left' },
        },
      }}
    />
  );
}

export default PieActiveArc;