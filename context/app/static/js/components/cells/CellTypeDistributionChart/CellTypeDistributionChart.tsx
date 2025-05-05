import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { withParentSize, WithParentSizeProvidedProps } from '@visx/responsive';
import useCellTypeCountForTissue, { CellTypeCountForTissue } from 'js/api/scfind/useCellTypeCountForTissue';
import { useChartTooltip, useLinearScale, useOrdinalScale } from 'js/shared-styles/charts/hooks';
import { useChartPalette } from 'js/shared-styles/charts/HorizontalStackedBarChart/hooks';
import { TooltipData } from 'js/shared-styles/charts/types';
import React, { useMemo } from 'react';
import Description from 'js/shared-styles/sections/Description';
import { grey, blueGrey, teal } from '@mui/material/colors';
import { LegendItem, LegendLabel, LegendOrdinal } from '@visx/legend';
import { decimal } from 'js/helpers/number-format';
import { capitalizeString } from 'js/helpers/functions';
import { useCellVariableNames } from '../MolecularDataQueryForm/hooks';

interface FractionGraphProps extends WithParentSizeProvidedProps {
  data: CellTypeCountForTissue[];
  tissue: string;
}

const unselectedCellColors = [
  grey[300],
  grey[400],
  grey[500],
  grey[600],
  grey[700],
  blueGrey[300],
  blueGrey[400],
  blueGrey[500],
  blueGrey[600],
  blueGrey[700],
  teal[300],
  teal[400],
  teal[500],
  teal[600],
  teal[700],
];

function Fraction({ data, parentWidth, tissue }: FractionGraphProps) {
  const targetCellTypes = useCellVariableNames();

  const {
    counts: cellCounts,
    otherLabels: otherCellLabels,
    targetLabels: presentTargetCellTypes,
    total: totalCellCount,
    countsMap: mappedCellCounts,
    sortedData,
  } = useMemo(() => {
    // Sort the data by cell count in descending order, hoisting target cell types to the top
    const sorted = [...(data ?? [])].sort((a, b) => {
      const aIsTarget = targetCellTypes.includes(a.index);
      const bIsTarget = targetCellTypes.includes(b.index);
      if (aIsTarget && !bIsTarget) return -1; // a is target, b is not -> a comes first
      if (!aIsTarget && bIsTarget) return 1; // b is target, a is not -> b comes first
      // If both are target or both are not, sort by cell count, falling back to alphabetical order
      // if the counts are equal
      const diff = b.cell_count - a.cell_count;
      if (diff === 0) {
        return a.index.localeCompare(b.index); // Sort by index if counts are equal
      }
      return diff;
    });
    const results = sorted.reduce(
      ({ counts, otherLabels, targetLabels, total, countsMap }, { index: label, cell_count }) => {
        const newTotal = total + cell_count;
        counts.push(cell_count);
        countsMap[label] = cell_count;
        if (!targetCellTypes.includes(label)) {
          otherLabels.push(label);
        } else {
          targetLabels.push(label);
        }
        return {
          counts,
          otherLabels,
          targetLabels,
          total: newTotal,
          countsMap,
        };
      },
      {
        counts: [] as number[],
        otherLabels: [] as string[],
        targetLabels: [] as string[],
        total: 0,
        countsMap: {} as Record<string, number>,
      },
    );
    return {
      ...results,
      sortedData: sorted,
    };
  }, [data, targetCellTypes]);

  const scale = useLinearScale(cellCounts, {
    range: [0, parentWidth!], // range to normalize the values to percentages
    domain: [0, totalCellCount],
  });

  const xOffsets = useMemo(() => {
    const results = cellCounts.reduce(
      ({ currentOffset, offsets }, currentValue) => {
        offsets.push(currentOffset);
        const newOffset: number = currentOffset + (scale(currentValue) as number);
        return { currentOffset: newOffset, offsets };
      },
      {
        currentOffset: 0,
        offsets: [] as number[],
      },
    );
    return results.offsets;
  }, [cellCounts, scale]);

  const targetCellColors = useChartPalette();
  const targetColorScale = useOrdinalScale(presentTargetCellTypes, {
    domain: presentTargetCellTypes,
    range: targetCellColors,
  });
  const otherColorScale = useOrdinalScale(otherCellLabels, {
    domain: otherCellLabels,
    range: unselectedCellColors,
  });

  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    containerRef,
    TooltipInPortal,
    handleMouseEnter,
    handleMouseLeave,
  } = useChartTooltip<TooltipData<CellTypeCountForTissue>>();

  return (
    <>
      <Typography variant="subtitle2" component="label" color="primary" mb={1}>
        Cell Type Distribution Across {capitalizeString(tissue)} Datasets
      </Typography>
      <svg direction="row" width={parentWidth} height="50" ref={containerRef}>
        {sortedData.map(({ cell_count, index: label }, index) => {
          const isTargetedCellType = targetCellTypes.includes(label);
          return (
            <rect
              key={label}
              width={scale(cell_count) as number}
              x={xOffsets[index]}
              height={isTargetedCellType ? 40 : 30}
              y={isTargetedCellType ? 5 : 10}
              fill={isTargetedCellType ? targetColorScale(label) : otherColorScale(label)}
              // Highlight the bar if it is currently being hovered for the tooltip
              filter={
                label === tooltipData?.key ? 'brightness(120%) drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.5))' : undefined
              }
              style={{ transition: 'filter 0.2s ease-in-out' }}
              onMouseEnter={handleMouseEnter({
                key: label,
                bar: { data: { cell_count, index: label } },
              })}
              rx={isTargetedCellType ? 5 : 0}
              ry={isTargetedCellType ? 5 : 0}
              onMouseLeave={handleMouseLeave}
              aria-label={`${label}: ${cell_count} (${((cell_count / totalCellCount) * 100).toFixed(2)}%)`}
            />
          );
        })}
      </svg>
      <Typography variant="body1" color="textSecondary" my={1}>
        Indexed {tissue} datasets contain {decimal.format(totalCellCount)} cells in {data.length} cell types.
      </Typography>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mt={1}>
        <Stack>
          <Typography variant="body2" color="textSecondary" my={1}>
            Targeted Cell Types
          </Typography>
          <LegendOrdinal scale={targetColorScale} labelFormat={(label) => label.split('.').slice(1).join('.')}>
            {(labels) => (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {labels.map((label) => {
                  if (!label.text) return null;
                  return (
                    <LegendItem key={`legend-${label.text}`} margin="0 15px 0 0">
                      <svg width="1em" height="1em" style={{ borderRadius: '4px' }}>
                        <rect fill={targetColorScale(label.datum)} width="1em" height="1em" />
                      </svg>
                      <LegendLabel align="left" margin="0 0 0 4px">
                        {label.text} ({decimal.format(mappedCellCounts[label.datum])} cells,{' '}
                        {decimal.format((mappedCellCounts[label.datum] / totalCellCount) * 100)}% of total)
                      </LegendLabel>
                    </LegendItem>
                  );
                })}
              </div>
            )}
          </LegendOrdinal>
        </Stack>
        <Stack>
          <Typography variant="body2" color="textSecondary" my={1}>
            Other Cell Types
          </Typography>
          <Box maxHeight={300} overflow="auto">
            <LegendOrdinal
              scale={otherColorScale}
              labelFormat={(label) => label.split('.').slice(1).join('.')}
              shapeStyle={() => ({ borderRadius: '4px' })}
            />
          </Box>
        </Stack>
      </Stack>
      {tooltipOpen && tooltipData && (
        <TooltipInPortal left={tooltipLeft} top={tooltipTop} style={{ position: 'absolute', pointerEvents: 'none' }}>
          {tooltipData?.bar?.data && (
            <Box sx={{ background: 'white', padding: 2, borderRadius: 4, zIndex: 1000 }}>
              <Typography variant="subtitle1" component="p" color="textPrimary">
                {tooltipData.bar.data.index.split('.')[1]}
              </Typography>
              <Typography variant="body2" component="p" color="textSecondary">
                Cell Count: {tooltipData.bar.data.cell_count}
              </Typography>
              <Typography variant="body2" component="p" color="textSecondary">
                Percentage: {decimal.format((tooltipData.bar.data.cell_count / totalCellCount) * 100)}%
              </Typography>
            </Box>
          )}
        </TooltipInPortal>
      )}
    </>
  );
}

const FractionGraph = withParentSize(Fraction);

interface CellTypeDistributionChartProps {
  tissue: string;
}

export default function CellTypeDistributionChart({ tissue }: CellTypeDistributionChartProps) {
  const { data, isLoading } = useCellTypeCountForTissue({ tissue });

  if (isLoading) {
    return <Skeleton variant="rectangular" width="100%" height={300} />;
  }

  if (!data) {
    return <div>No cell type distribution data available</div>;
  }

  return (
    <div>
      <Description>
        The bar below shows the distribution of cell types in the {tissue} tissue. The distribution is based on the
        number of cells annotated in HuBMAP datasets and indexed by scFind.
      </Description>
      <FractionGraph data={data.cellTypeCounts} tissue={tissue} />
    </div>
  );
}
