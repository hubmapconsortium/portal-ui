import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { withParentSize, WithParentSizeProvidedProps } from '@visx/responsive';
import { CellTypeCountForTissue } from 'js/api/scfind/useCellTypeCountForTissue';
import { useChartTooltip, useLinearScale, useOrdinalScale } from 'js/shared-styles/charts/hooks';
import { useChartPalette } from 'js/shared-styles/charts/HorizontalStackedBarChart/hooks';
import { TooltipData } from 'js/shared-styles/charts/types';
import React from 'react';
import { grey, blueGrey, teal } from '@mui/material/colors';
import { LegendItem, LegendLabel, LegendOrdinal } from '@visx/legend';
import { decimal } from 'js/helpers/number-format';
import { capitalizeString } from 'js/helpers/functions';
import { ScaleLinear } from 'd3';
import { useCellVariableNames } from '../MolecularDataQueryForm/hooks';
import { useProcessedData, useXOffsets } from './hooks';
import FractionRect from './FractionGraphRect';

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
  } = useProcessedData(data);

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
        {sortedData.map(({ index: label }, index) => {
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
                bar: { data: { cell_count: sortedData[index].cell_count, index: label } },
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
                    <LegendItem key={`legend-${label.text}`} margin="0 1rem 0 0">
                      <svg width="1em" height="1em" style={{ borderRadius: '0.25rem' }}>
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

export default FractionGraph;
