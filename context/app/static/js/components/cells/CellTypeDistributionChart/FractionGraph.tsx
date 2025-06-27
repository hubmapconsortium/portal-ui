import Typography from '@mui/material/Typography';
import { withParentSize, WithParentSizeProvidedProps } from '@visx/responsive';
import { CellTypeCountForTissue } from 'js/api/scfind/useCellTypeCountForTissue';
import { useChartTooltip, useLinearScale, useOrdinalScale } from 'js/shared-styles/charts/hooks';
import { useChartPalette } from 'js/shared-styles/charts/HorizontalStackedBarChart/hooks';
import { TooltipData } from 'js/shared-styles/charts/types';
import React from 'react';
import { decimal } from 'js/helpers/number-format';
import { capitalizeString } from 'js/helpers/functions';
import { ScaleLinear } from 'd3';
import { useProcessedFractionData, useXOffsets } from './hooks';
import FractionRect from './FractionGraphRect';
import FractionGraphLegend from './FractionGraphLegend';
import FractionGraphTooltip from './FractionGraphTooltip';
import { unselectedCellColors } from './utils';

interface FractionGraphProps extends WithParentSizeProvidedProps {
  data: CellTypeCountForTissue[];
  tissue: string;
  targetCellTypes: string[];
}

function Fraction({ data, parentWidth, tissue, targetCellTypes }: FractionGraphProps) {
  const {
    counts: cellCounts,
    otherLabels: otherCellLabels,
    targetLabels: presentTargetCellTypes,
    total: totalCellCount,
    countsMap: mappedCellCounts,
    sortedData,
  } = useProcessedFractionData(data, targetCellTypes);

  const scale = useLinearScale(cellCounts, {
    range: [0, parentWidth!], // range to normalize the values to percentages
    domain: [0, totalCellCount],
  }) as ScaleLinear<number, number, never>;

  const xOffsets = useXOffsets(cellCounts, scale);

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

  const id = `cell-type-distribution-${tissue}`;

  return (
    <>
      <Typography variant="subtitle2" component="label" color="primary" display="block" my={1} htmlFor={id}>
        Cell Type Distribution Across {capitalizeString(tissue)} Datasets
      </Typography>
      <svg direction="row" width={parentWidth} height="50" ref={containerRef} id={id}>
        {sortedData.map(({ index: label, cell_count }, index) => {
          return (
            <FractionRect
              label={label}
              index={index}
              key={`cell-type-${label}`}
              isTargetedCellType={targetCellTypes.includes(label)}
              isHoveredCellType={tooltipOpen && tooltipData?.key === label}
              scale={scale}
              xOffsets={xOffsets}
              onMouseEnter={handleMouseEnter({
                key: label,
                bar: { data: { cell_count, index: label } },
              })}
              onMouseLeave={handleMouseLeave}
              totalCellCount={totalCellCount}
              sortedData={sortedData}
              targetColorScale={targetColorScale}
              otherColorScale={otherColorScale}
            />
          );
        })}
      </svg>
      <Typography variant="body1" color="textSecondary" my={1}>
        Indexed {tissue} datasets contain {decimal.format(totalCellCount)} cells in {data.length} cell types.
      </Typography>
      <FractionGraphLegend
        otherColorScale={otherColorScale}
        targetColorScale={targetColorScale}
        mappedCellCounts={mappedCellCounts}
        totalCellCount={totalCellCount}
      />
      <FractionGraphTooltip
        tooltipData={tooltipData}
        tooltipOpen={tooltipOpen}
        tooltipTop={tooltipTop}
        tooltipLeft={tooltipLeft}
        totalCellCount={totalCellCount}
        TooltipInPortal={TooltipInPortal}
      />
    </>
  );
}

const FractionGraph = withParentSize(Fraction);

export default FractionGraph;
