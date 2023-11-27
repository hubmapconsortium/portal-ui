import React from 'react';
import { Group } from '@visx/group';
import { BarStack } from '@visx/shape';
import { scaleBand, scaleLog, scaleOrdinal } from '@visx/scale';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import Description from 'js/shared-styles/sections/Description';

import { AxisBottom, AxisLeft } from '@visx/axis';
import { DetailPageSection } from '../detailPage/style';
import { CellTypeOrgan } from './hooks';

// Define the keys for the stack
const keys = ['celltype_cells', 'other_cells'];

// Define the color for each key
const colorScale = scaleOrdinal({
  domain: keys,
  range: ['#4B5F27', '#89A05F'],
});

// Define the scale for the X axis
const organScale = (data: CellTypeOrgan[]) =>
  scaleBand({
    domain: data.map((d) => d.organ),
    padding: 0.2,
  });

// Define the scale for the Y axis
const cellCountScale = (data: CellTypeOrgan[]) =>
  scaleLog<number>({
    domain: [1, Math.max(...data.map((d) => d.total_cells))],
    nice: true,
  });

const organs = [
  { celltype_cells: 179, organ: 'Heart', total_cells: 73111, other_cells: 72932 },
  { celltype_cells: 507, organ: 'Kidney', total_cells: 1369014, other_cells: 1368507 },
] as CellTypeOrgan[];

export default function CellTypesVisualization() {
  // const { data: organs } = useCellTypeOrgans();

  if (!organs) {
    return null;
  }

  const xMax = 400;
  const yMax = 400;

  const x = organScale(organs).range([0, xMax]);
  const y = cellCountScale(organs).range([yMax, 1]);

  return (
    <DetailPageSection>
      <SectionHeader>Visualization</SectionHeader>
      <Description>Cell counts in this visualization are dependent on the data available within HuBMAP.</Description>
      <svg width={500} height={500}>
        <Group top={20} left={50}>
          <BarStack
            data={organs}
            keys={keys}
            x={(d) => d.organ}
            xScale={x}
            yScale={y}
            color={colorScale}
            order="ascending"
          >
            {(barStacks) =>
              barStacks.map((barStack) =>
                barStack.bars.map((bar) => {
                  return (
                    <rect
                      key={`bar-stack-${barStack.index}-${bar.index}`}
                      x={bar.x}
                      y={bar.y}
                      height={bar.height}
                      width={bar.width}
                      fill={bar.color}
                      data-key={bar.key}
                    />
                  );
                }),
              )
            }
          </BarStack>
          <AxisLeft scale={y} label="Cell Counts (log)" numTicks={10} />
          <AxisBottom scale={x} top={yMax} />
        </Group>
      </svg>
    </DetailPageSection>
  );
}
