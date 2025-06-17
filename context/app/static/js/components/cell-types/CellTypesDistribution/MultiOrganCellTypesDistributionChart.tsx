import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { decimal, percent } from 'js/helpers/number-format';
import ChartWrapper from 'js/shared-styles/charts/ChartWrapper';
import { useBandScale, useOrdinalScale } from 'js/shared-styles/charts/hooks';
import { useChartPalette } from 'js/shared-styles/charts/HorizontalStackedBarChart/hooks';
import { TooltipData } from 'js/shared-styles/charts/types';
import VerticalStackedBarChart from 'js/shared-styles/charts/VerticalStackedBarChart';
import { LabeledPrimarySwitch } from 'js/shared-styles/switches';
import InfoTextTooltip from 'js/shared-styles/tooltips/InfoTextTooltip';
import React, { useMemo } from 'react';
import { ScaleContinuousNumeric } from 'd3';
import Skeleton from '@mui/material/Skeleton';
import { unselectedCellColors } from 'js/components/cells/CellTypeDistributionChart/utils';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableFooter from '@mui/material/TableFooter';
import { formatCellTypeName } from 'js/api/scfind/utils';
import { ChartData } from './types';
import { useCellTypeCountData, useYScale } from './hooks';
import CellTypesDistributionChartContextProvider, {
  useCellTypesDistributionChartContext,
  CellTypeDataContextProvider,
  useCellTypeDataContext,
} from './contexts';
import { useCellTypesContext } from '../CellTypesContext';
import { CellTypeCountWithPercentageAndOrgan } from './utils';

interface MultiOrganCellTypeDistributionChartProps {
  cellTypes: string[];
  organs: string[];
}

interface TooltipTableProps {
  organ: string;
  cellTypes: string[];
  cellTypeCounts: CellTypeCountWithPercentageAndOrgan[];
}

function TooltipTable({ organ, cellTypes, cellTypeCounts }: TooltipTableProps) {
  const targetCellTypes = cellTypeCounts.filter((count) => cellTypes.includes(count.name));

  const otherCellTypes = cellTypeCounts.filter((count) => !cellTypes.includes(count.name));

  const totalOtherCount = otherCellTypes.reduce((acc, count) => acc + count.count, 0);

  const totalCellsInOrgan = cellTypeCounts.reduce((acc, count) => acc + count.count, 0);

  const { colorScale } = useCellTypeDataContext();

  return (
    <Stack direction="column" spacing={1}>
      <Typography variant="body2" fontWeight="bold">
        {organ}
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell aria-hidden padding="checkbox" />
            <TableCell>Cell Type</TableCell>
            <TableCell>Count</TableCell>
            <TableCell>Percentage</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {targetCellTypes.map(({ name, count }) => (
            <TableRow key={name}>
              <TableCell aria-hidden padding="checkbox">
                <Stack direction="row" alignItems="center">
                  <svg width="1em" height="1em" style={{ borderRadius: '0.25rem', marginRight: '-0.5rem' }}>
                    <rect fill={colorScale(name)} width="1em" height="1em" />
                  </svg>
                </Stack>
              </TableCell>
              <TableCell> {name}</TableCell>
              <TableCell>{decimal.format(count)}</TableCell>
              <TableCell>{percent.format(count / totalCellsInOrgan)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell aria-hidden padding="checkbox" />
            <TableCell>Other Cell Types</TableCell>
            <TableCell>{decimal.format(totalOtherCount)}</TableCell>
            <TableCell>{percent.format(totalOtherCount / totalCellsInOrgan)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell aria-hidden padding="checkbox" />
            <TableCell>Total</TableCell>
            <TableCell colSpan={2}>{decimal.format(totalCellsInOrgan)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </Stack>
  );
}

function AxisLabelTooltip({ label }: { label: string }) {
  const { cellTypeCounts } = useCellTypeDataContext();
  const cellTypeCountsForOrgan = cellTypeCounts[label];
  const { cellTypes } = useCellTypesContext();
  const formattedCellTypes = cellTypes.map((type) => formatCellTypeName(type));
  return <TooltipTable organ={label} cellTypes={formattedCellTypes} cellTypeCounts={cellTypeCountsForOrgan} />;
}

function TooltipContent({ tooltipData }: { tooltipData: TooltipData<ChartData> }) {
  const { bar, key: tooltipKey } = tooltipData;
  const { cellTypeCounts } = useCellTypeDataContext();
  const { cellTypes } = useCellTypesContext();
  if (!bar?.data) {
    return <AxisLabelTooltip label={String(tooltipKey)} />;
  }
  const { organ } = bar.data;
  const cellTypeName = String(tooltipKey);
  const cellTypeCountsForOrgan = cellTypeCounts[bar.data.organ];
  const formattedCellTypes = cellTypes.map((type) => formatCellTypeName(type));
  return (
    <TooltipTable
      organ={organ}
      cellTypes={[cellTypeName, ...formattedCellTypes]}
      cellTypeCounts={cellTypeCountsForOrgan}
    />
  );
}

function ChartControls() {
  const {
    showPercentages,
    setShowPercentages,
    showOtherCellTypes,
    setShowOtherCellTypes,
    symLogScale,
    setSymLogScale,
  } = useCellTypesDistributionChartContext();

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <LabeledPrimarySwitch
        label={
          <InfoTextTooltip
            tooltipTitle="Toggle between displaying data as raw counts or fractions."
            infoIconSize="large"
          >
            Graph Type
          </InfoTextTooltip>
        }
        disabledLabel="Total Count"
        enabledLabel="Fraction"
        checked={showPercentages}
        onChange={(e) => setShowPercentages(e.target.checked)}
        ariaLabel="Graph Type"
      />
      <LabeledPrimarySwitch
        label={
          <InfoTextTooltip
            tooltipTitle="Toggle between displaying or hiding the other cell types in the organs cell type appears in."
            infoIconSize="large"
          >
            Show Other Cell Types
          </InfoTextTooltip>
        }
        disabledLabel="Hide"
        enabledLabel="Show"
        checked={showOtherCellTypes}
        onChange={(e) => setShowOtherCellTypes(e.target.checked)}
        ariaLabel="Show Other Cell Types"
      />
      {!showPercentages && (
        <LabeledPrimarySwitch
          label={
            <InfoTextTooltip
              tooltipTitle="Toggle between linear and symmetric log scale for the counts. Symmetric log scale is useful for visualizing data with a wide range of values."
              infoIconSize="large"
            >
              Counts Scale
            </InfoTextTooltip>
          }
          disabledLabel="Linear"
          enabledLabel="Symmetric Log"
          checked={symLogScale}
          onChange={(e) => setSymLogScale(e.target.checked)}
          ariaLabel="Use Symmetric Log Scale"
        />
      )}
    </Stack>
  );
}

function getSymLogTickValues(y: ScaleContinuousNumeric<number, number, never>) {
  // Find the highest power of 10 lower than the maximum cell count
  const maxValue = y.domain()[1];
  const maxLog = Math.floor(Math.log10(maxValue));
  const tickValues = [];
  // Get the max tick values based on the highest power of 10
  for (let i = 0; i <= maxValue; i += 10 ** maxLog) {
    tickValues.push(i);
  }
  // Add the powers of 10 down to 1
  for (let j = maxLog - 1; j >= 1; j -= 1) {
    tickValues.push(10 ** j);
  }
  return tickValues;
}

function useGetTickValues() {
  const { showPercentages, symLogScale } = useCellTypesDistributionChartContext();

  if (showPercentages || !symLogScale) {
    return undefined; // Use default tick values for linear count scale
  }
  return getSymLogTickValues;
}

function MultiOrganCellTypeDistributionChart({ cellTypes, organs }: MultiOrganCellTypeDistributionChartProps) {
  const {
    cellTypeCountsRecord,
    fullCellTypeData,
    isLoading,
    targetCellTypeKeys,
    otherCellTypeKeys,
    allCellTypeKeys,
    maxCellCount,
    visxData,
  } = useCellTypeCountData(organs, cellTypes);

  const { showOtherCellTypes, showPercentages } = useCellTypesDistributionChartContext();

  const chartPalette = useChartPalette();
  const chartPaletteSubset = chartPalette.slice(0, targetCellTypeKeys.length);
  const targetColorScale = useOrdinalScale(targetCellTypeKeys, {
    domain: targetCellTypeKeys,
    range: chartPaletteSubset,
  });

  const combinedRange = useMemo(() => {
    if (!showOtherCellTypes) {
      return chartPaletteSubset;
    }
    const otherCellTypeColor = unselectedCellColors[0];
    return [...chartPaletteSubset, ...Array<string>(otherCellTypeKeys.length).fill(otherCellTypeColor)];
  }, [chartPaletteSubset, otherCellTypeKeys.length, showOtherCellTypes]);

  const combinedColorScale = useOrdinalScale(allCellTypeKeys, {
    domain: allCellTypeKeys,
    range: combinedRange,
  });

  const yScale = useYScale(fullCellTypeData, maxCellCount);

  const xScale = useBandScale(organs);

  const getTickValues = useGetTickValues();

  if (isLoading) {
    return <Skeleton variant="rectangular" width="100%" height={500} />;
  }

  return (
    <CellTypeDataContextProvider value={{ cellTypeCounts: cellTypeCountsRecord, colorScale: combinedColorScale }}>
      <Paper sx={{ px: 2, pb: 2 }}>
        <ChartWrapper
          colorScale={targetColorScale}
          dividersInLegend
          margin={{
            top: 20,
            right: 20,
            bottom: 50,
            left: 100,
          }}
          dropdown={<Typography variant="body1">Cell Types</Typography>}
          additionalControls={<ChartControls />}
        >
          <VerticalStackedBarChart
            visxData={visxData}
            colorScale={combinedColorScale}
            yScale={yScale}
            xScale={xScale}
            getX={(d) => d.organ}
            keys={showOtherCellTypes ? allCellTypeKeys : targetCellTypeKeys}
            margin={{
              top: 20,
              right: 20,
              bottom: 50,
              left: 100,
            }}
            xAxisLabel="Organs"
            yAxisLabel={showPercentages ? 'Cell Fraction' : 'Cell Count'}
            xAxisTickLabels={organs}
            TooltipContent={TooltipContent}
            // @ts-expect-error Annoying type error with scale types
            getTickValues={getTickValues}
            // eslint-disable-next-line @typescript-eslint/unbound-method
            yTickFormat={showPercentages ? percent.format : decimal.format}
          />
        </ChartWrapper>
      </Paper>
    </CellTypeDataContextProvider>
  );
}

export default function MultiOrganCellTypeDistributionChartWithProvider(
  props: MultiOrganCellTypeDistributionChartProps,
) {
  return (
    <CellTypesDistributionChartContextProvider>
      <MultiOrganCellTypeDistributionChart {...props} />
    </CellTypesDistributionChartContextProvider>
  );
}
