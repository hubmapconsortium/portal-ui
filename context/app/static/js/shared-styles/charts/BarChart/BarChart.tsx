import { WithParentSizeProvidedProps, withParentSize } from '@visx/responsive';
import React, { useMemo } from 'react';
import { AxisBottom, AxisLeft, AxisScale } from '@visx/axis';
import Typography from '@mui/material/Typography';
import { useBandScale, useChartTooltip, useLinearScale, useOrdinalScale, useVerticalChart } from '../hooks';
import TickComponent from '../TickComponent';
import VerticalChartGridRowsGroup from '../VerticalChartGridRowsGroup';
import { TooltipComponentType, TooltipData, tooltipHasBarData } from '../types';
import { ScaleOrdinal } from 'd3';
import { useTheme } from '@mui/material/styles';

interface MultiGeneAssociation {
  cellType: string;
  genes: string[];
  colors: string[];
}

interface BarChartProps<T extends { value: number }, K extends string, D extends Record<K, T>>
  extends WithParentSizeProvidedProps {
  data: D;
  highlightedKeys?: K[];
  margin?: { top: number; right: number; bottom: number; left: number };
  yAxisLabel: string;
  xAxisLabel: string;
  TooltipContent?: TooltipComponentType<T>;
  colorScale?: ScaleOrdinal<string, string>;
  multiGeneAssociations?: MultiGeneAssociation[];
}

/**
 * This component creates a Bar Chart from a passed record of string keys to number values.
 *
 */
function BarChart<T extends { value: number }, K extends string, D extends Record<K, T>>({
  data,
  highlightedKeys,
  parentWidth = 0,
  parentHeight = 500,
  margin = { top: 20, right: 20, bottom: 20, left: 20 },
  yAxisLabel,
  xAxisLabel,
  TooltipContent,
  colorScale: externalColorScale,
  multiGeneAssociations = [],
}: BarChartProps<T, K, D>) {
  const keys: K[] = (Object.entries(data) as [K, T][])
    .sort(([aKey, aValue], [bKey, bValue]) => {
      // if one of the highlighted keys is in the data, move it to the front;
      // if both are included, sort by value
      const includesA = highlightedKeys?.includes(aKey);
      const includesB = highlightedKeys?.includes(bKey);
      if (includesA && includesB) return bValue.value - aValue.value;
      if (includesA) return -1;
      if (includesB) return 1;
      return bValue.value - aValue.value;
    })
    .map(([key]) => key);
  const values = Object.values(data).map((v) => (v as T).value);
  const tickLabelSize = 11;
  const { xWidth, yHeight, updatedMargin, longestLabelSize } = useVerticalChart({
    margin,
    tickLabelSize,
    xAxisTickLabels: keys,
    parentWidth,
    parentHeight,
  });

  const xScale = useBandScale(keys, { range: [0, xWidth] });
  const yScale = useLinearScale(values, { range: [yHeight, 0] });

  const theme = useTheme();

  const colorScale = useOrdinalScale(['matched', 'unmatched'], {
    range: [theme.palette.graphs.matched, theme.palette.graphs.unmatched],
  });

  // Create a map of cell types to their gene associations for pattern generation
  const cellTypeToGenes = useMemo(() => {
    const map = new Map<string, { genes: string[]; colors: string[] }>();
    multiGeneAssociations.forEach(({ cellType, genes, colors }) => {
      map.set(cellType, { genes, colors });
    });
    return map;
  }, [multiGeneAssociations]);

  // Function to create HTML-safe IDs for SVG patterns
  const createSafeId = (key: K) => {
    return `pattern-${String(key).replace(/[^a-zA-Z0-9-_]/g, '_')}`;
  };

  // Function to create patterns for multi-gene associations similar to StackedBar
  const createPattern = (key: K, id: string) => {
    const geneAssociation = cellTypeToGenes.get(key as string);

    if (!geneAssociation || geneAssociation.genes.length <= 1) {
      // Single gene or no association - use solid color
      const fill =
        externalColorScale?.(key as string) ?? colorScale(highlightedKeys?.includes(key) ? 'matched' : 'unmatched');
      return (
        <pattern id={id} patternUnits="userSpaceOnUse" width="1.5" height="1.5" patternTransform="rotate(90)">
          <rect width="100%" height="100%" fill={fill} />
        </pattern>
      );
    }

    // Multi-gene association - create stripes
    const { genes, colors } = geneAssociation;
    return (
      <pattern
        id={id}
        patternUnits="userSpaceOnUse"
        width={genes.length}
        height={genes.length}
        patternTransform="rotate(90)"
      >
        {genes.map((gene, index) => (
          <line
            key={gene}
            x1={index + 0.5}
            y1={0}
            x2={index + 0.5}
            y2={genes.length}
            stroke={colors[index]}
            strokeWidth="1"
          />
        ))}
      </pattern>
    );
  };

  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    containerRef,
    TooltipInPortal,
    handleMouseEnter,
    handleMouseLeave,
  } = useChartTooltip<TooltipData<T>>();

  return (
    <>
      <svg width={parentWidth} height={parentHeight} ref={containerRef}>
        <defs>
          {keys.map((key) => {
            const patternId = createSafeId(key);
            return <React.Fragment key={`pattern-${key}`}>{createPattern(key, patternId)}</React.Fragment>;
          })}
        </defs>
        <VerticalChartGridRowsGroup
          getTickValues={(y: typeof yScale) => y.ticks(5)}
          margin={updatedMargin}
          yScale={yScale}
          xWidth={xWidth}
        >
          {keys.map((key) => {
            const { value } = data[key];
            const barWidth = xScale.bandwidth() / 2;
            const barX = (xScale(key) ?? 0) + barWidth / 2;
            const barY = yScale(value) as number;
            const barHeight = yHeight - barY;
            const patternId = createSafeId(key);

            return (
              <rect
                key={key}
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight}
                fill={`url(#${patternId})`}
                onMouseEnter={handleMouseEnter({ key, bar: { data: data[key] } })}
                onMouseLeave={handleMouseLeave}
              />
            );
          })}
          <AxisLeft
            hideTicks
            scale={yScale as AxisScale}
            label={yAxisLabel}
            stroke="black"
            tickLabelProps={() => ({
              fill: 'black',
              fontSize: 11,
              textAnchor: 'end',
              dy: '0.33em',
            })}
            labelProps={{
              fontSize: 14,
              color: 'black',
              fontWeight: 500,
              fontFamily: 'Inter Variable',
            }}
          />
          <AxisBottom
            hideTicks
            top={yHeight}
            scale={xScale}
            label={xAxisLabel}
            stroke="black"
            tickStroke="black"
            numTicks={keys.length}
            labelOffset={longestLabelSize}
            tickLabelProps={() => ({
              fill: 'black',
              fontSize: tickLabelSize,
              textAnchor: 'end',
              angle: -90,
            })}
            tickComponent={TickComponent({ handleMouseEnter, handleMouseLeave, data })}
            labelProps={{
              fontSize: 14,
              color: 'black',
              fontWeight: 500,
              fontFamily: 'Inter Variable',
            }}
          />
        </VerticalChartGridRowsGroup>
      </svg>

      {tooltipOpen && tooltipData && (
        <TooltipInPortal top={tooltipTop} left={tooltipLeft}>
          {TooltipContent ? (
            <TooltipContent tooltipData={tooltipData} />
          ) : (
            <>
              <Typography>{tooltipData.key}</Typography>
              {tooltipHasBarData(tooltipData) && (
                <Typography variant="h6" component="p" color="textPrimary">
                  {tooltipData.bar.data[tooltipData.key]}
                </Typography>
              )}
            </>
          )}
        </TooltipInPortal>
      )}
    </>
  );
}

export default withParentSize(BarChart);
