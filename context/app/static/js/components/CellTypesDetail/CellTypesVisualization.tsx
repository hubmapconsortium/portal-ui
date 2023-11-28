import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { BarStack } from '@visx/shape';
import { AxisBottom, AxisLeft, TickLabelProps } from '@visx/axis';
import { scaleBand, scaleLog, scaleOrdinal } from '@visx/scale';
import { Group } from '@visx/group';
import { GridRows } from '@visx/grid';
import { LegendItem, LegendLabel, LegendOrdinal } from '@visx/legend';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import Description from 'js/shared-styles/sections/Description';

import useResizeObserver from 'use-resize-observer/polyfilled';
import { Tooltip, useTooltip, useTooltipInPortal } from '@visx/tooltip';
import { DetailPageSection } from '../detailPage/style';
import { CellTypeOrgan, useCellTypeOrgans } from './hooks';

// Define the keys for the stack
type GraphKeys = 'total_cells' | 'celltype_cells';
const keys = ['total_cells', 'celltype_cells'] as GraphKeys[];
const keyLabels: Record<GraphKeys, string> = {
  total_cells: 'Total Cells',
  celltype_cells: 'Cell Type Cells',
};

// Define the color for each key
const colorScale = scaleOrdinal({
  domain: keys,
  range: ['#89A05F', '#4B5F27'],
});

const height = 500;
const margin = { top: 20, right: 20, bottom: 100, left: 60 };

const organTickLabelProps = {
  angle: -60,
  textAnchor: 'end',
  fontSize: 12,
  fontFamily: 'Inter Variable',
  fontWeight: 300,
  dy: '0.25em',
} as const;

export default function CellTypesVisualization() {
  const { data: organs = [] } = useCellTypeOrgans();
  const sortedOrgans = [...organs].sort((a, b) => b.total_cells - a.total_cells);

  const tooltipTimeout = React.useRef<number>();

  const { tooltipOpen, tooltipLeft, tooltipTop, tooltipData, hideTooltip, showTooltip } = useTooltip<CellTypeOrgan>();
  const { containerRef: svgRef, TooltipInPortal } = useTooltipInPortal();

  const { ref: containerRef, width = 0 } = useResizeObserver<HTMLDivElement>();
  // Set the max width and height of the graph
  const xMax = Math.max(width - margin.left - margin.right, 0);
  const yMax = Math.max(height - margin.top - margin.bottom, 0);

  // Set the padding to be the minimum of the default padding or the max bar width
  const defaultXPadding = 0.5;
  const maxBarWidth = 50;
  const padding = Math.min(defaultXPadding, width / (sortedOrgans.length * maxBarWidth));

  const xScale = scaleBand({
    domain: sortedOrgans.map((d) => d.organ),
    range: [0, xMax],
    padding,
  });

  const yScale = scaleLog<number>({
    domain: [1, Math.max(...sortedOrgans.map((d) => d.total_cells))],
    nice: true,
    range: [yMax, 0],
  });

  // Only show ticks for powers of 10
  const rowTickValues = yScale.ticks(5).filter((d) => Number.isInteger(Math.log10(d)));

  const axisLabelProps: TickLabelProps<string> = {
    fontSize: 14,
    color: 'black',
    fontWeight: 500,
    fontFamily: 'Inter Variable',
  };

  return (
    <DetailPageSection>
      <SectionHeader>Visualization</SectionHeader>
      <Description>Cell counts in this visualization are dependent on the data available within HuBMAP.</Description>
      <Box position="relative" p={2} ref={containerRef}>
        {tooltipOpen && tooltipData && (
          <TooltipInPortal
            key={Math.random()} // update tooltip bounds each render
            top={tooltipTop}
            left={tooltipLeft}
          >
            <Stack>
              <Typography variant="body1" component="label">
                {tooltipData.organ} (## datasets)
              </Typography>
              <Typography variant="body1" component="label">
                (## CELL TYPE NAME) {tooltipData.total_cells} total cells
              </Typography>
            </Stack>
          </TooltipInPortal>
        )}
        <svg width={width} height={height} ref={svgRef}>
          <GridRows
            top={margin.top}
            left={margin.left}
            scale={yScale}
            width={xMax}
            height={yMax}
            stroke="black"
            strokeOpacity={0.1}
            tickValues={rowTickValues}
          />
          <Group top={margin.top} left={margin.left}>
            <BarStack<CellTypeOrgan, GraphKeys>
              data={sortedOrgans}
              keys={keys}
              x={(d) => d.organ}
              xScale={xScale}
              yScale={yScale}
              color={colorScale}
              height={height - margin.top - margin.bottom}
            >
              {(barStacks) =>
                barStacks.map((barStack) =>
                  barStack.bars.map((bar) => (
                    <rect
                      key={`bar-stack-${barStack.index}-${bar.index}`}
                      x={bar.x}
                      y={yScale(bar.bar.data[bar.key])}
                      height={height - margin.top - margin.bottom - yScale(bar.bar.data[bar.key])}
                      width={bar.width}
                      fill={bar.color}
                      data-key={bar.key}
                      data-value={bar.bar.data[bar.key]}
                      onMouseLeave={() => {
                        tooltipTimeout.current = window.setTimeout(() => {
                          hideTooltip();
                        }, 300);
                      }}
                      onMouseMove={(event) => {
                        if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
                        const top = event.pageY - window.scrollY - margin.top - margin.bottom;
                        const left = bar.x + bar.width / 2;
                        showTooltip({
                          tooltipData: bar.bar.data,
                          tooltipTop: top,
                          tooltipLeft: left,
                        });
                      }}
                    />
                  )),
                )
              }
            </BarStack>
            <AxisLeft label="Cell Count" labelProps={axisLabelProps} hideTicks scale={yScale} />
            <AxisBottom
              hideTicks
              scale={xScale}
              top={yMax}
              label="Organs"
              labelProps={{ ...axisLabelProps, dy: '2em' }}
              tickLabelProps={organTickLabelProps}
            />
          </Group>
        </svg>
        <Stack direction="column" spacing={0.5} p={2} position="absolute" right={0} top={2}>
          <Typography variant="body1" component="label">
            Cell Types
          </Typography>
          <LegendOrdinal scale={colorScale} labelFormat={(label) => keyLabels[label]}>
            {(labels) => (
              <>
                {labels.map((label) => (
                  <LegendItem key={`legend-quantile-${label.text}`}>
                    <svg width={15} height={15} style={{ borderRadius: 4 }}>
                      <rect fill={label.value} width={15} height={15} />
                    </svg>
                    <LegendLabel align="left" margin="0 0 0 4px">
                      {label.text}
                    </LegendLabel>
                  </LegendItem>
                ))}
              </>
            )}
          </LegendOrdinal>
        </Stack>
      </Box>
    </DetailPageSection>
  );
}
