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
          arcLabel: (item) => `${item.value.toFixed(2)}%`,
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
      height={400}
      width={550}
      margin={{ top: 20, bottom: 5, left: 5, right: 5 }}
      slotProps={{legend: {
          direction: 'row',
          position: { vertical: 'top', horizontal: 'middle' },
        },
      }}
    />
  );
}

export default PieActiveArc;