import { Skeleton } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { withParentSize, WithParentSizeProvidedProps } from '@visx/responsive';
import useCellTypeCountForTissue, { CellTypeCountForTissue } from 'js/api/scfind/useCellTypeCountForTissue';
import { useChartTooltip, useLinearScale, useOrdinalScale } from 'js/shared-styles/charts/hooks';
import { useChartPalette } from 'js/shared-styles/charts/HorizontalStackedBarChart/hooks';
import { TooltipData } from 'js/shared-styles/charts/types';
import React, { useMemo } from 'react';
import { useCellVariableNames } from '../MolecularDataQueryForm/hooks';

interface FractionGraphProps extends WithParentSizeProvidedProps {
  data: CellTypeCountForTissue[];
  totalCellCount: number;
}

function Fraction({ data, totalCellCount, parentWidth }: FractionGraphProps) {
  const cellTypes = useCellVariableNames();
  const [cellCounts, cellLabels] = useMemo(() => {
    if (!data) {
      return [[], []];
    }
    return data.reduce(
      ([counts, labels], cellTypeCount) => {
        counts.push(cellTypeCount.cell_count);
        labels.push(cellTypeCount.index);
        return [counts, labels];
      },
      [[], []] as [number[], string[]],
    );
  }, [data]);

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

  const colors = useChartPalette();
  const colorScale = useOrdinalScale(cellLabels, {
    domain: cellLabels,
    range: colors,
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
    <svg direction="row" width={parentWidth} height="50" ref={containerRef}>
      {data.map(({ cell_count, index: label }, index) => {
        const isTargetedCellType = cellTypes.includes(label);
        return (
          <rect
            key={label}
            width={scale(cell_count) as number}
            x={xOffsets[index]}
            height={isTargetedCellType ? 50 : 30}
            y={isTargetedCellType ? 0 : 10}
            fill={colorScale(label)}
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
      {tooltipOpen && tooltipData && (
        <TooltipInPortal left={tooltipLeft} top={tooltipTop} style={{ position: 'absolute', pointerEvents: 'none' }}>
          {tooltipData?.bar?.data && (
            <Box sx={{ background: 'white', padding: 2, borderRadius: 4, zIndex: 1000 }}>
              <Typography variant="subtitle1" component="p" color="textPrimary">
                {tooltipData.bar.data.index}
              </Typography>
              <Typography variant="body2" component="p" color="textSecondary">
                Cell Count: {tooltipData.bar.data.cell_count}
              </Typography>
              <Typography variant="body2" component="p" color="textSecondary">
                Total Cell Count: {totalCellCount}
              </Typography>
              <Typography variant="body2" component="p" color="textSecondary">
                Percentage: {((tooltipData.bar.data.cell_count / totalCellCount) * 100).toFixed(2)}%
              </Typography>
            </Box>
          )}
        </TooltipInPortal>
      )}
    </svg>
  );
}

const FractionGraph = withParentSize(Fraction);

interface CellTypeDistributionChartProps {
  tissue: string;
}

export default function CellTypeDistributionChart({ tissue }: CellTypeDistributionChartProps) {
  const cellTypes = useCellVariableNames();
  const { data, isLoading } = useCellTypeCountForTissue({ tissue });

  const [totalCellCount, cellTypeMetadata] = useMemo(() => {
    const total = data?.cellTypeCounts.reduce((acc, cellTypeCount) => acc + cellTypeCount.cell_count, 0) ?? 0;
    const metadata =
      data?.cellTypeCounts
        .filter((d) => cellTypes.includes(d.index))
        .map(({ cell_count, index }) => ({
          label: index,
          count: cell_count,
          percentage: (cell_count / total) * 100,
        })) ?? [];
    return [total, metadata];
  }, [data, cellTypes]);

  if (isLoading) {
    return <Skeleton variant="rectangular" width="100%" height={300} />;
  }

  if (!data) {
    return <div>No cell type distribution data available</div>;
  }

  const numFormat = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return (
    <div>
      <Typography variant="subtitle1">Cell Type Distribution Chart</Typography>

      {cellTypeMetadata.map(({ label, count, percentage }) => (
        <Typography variant="body2" color="textSecondary" key={label}>
          {label}: ({numFormat.format(count)} / {numFormat.format(totalCellCount)} total cells,{' '}
          {numFormat.format(percentage)}%)
        </Typography>
      ))}
      <FractionGraph data={data.cellTypeCounts} totalCellCount={totalCellCount} />
    </div>
  );
}
