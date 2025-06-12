import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useCellTypeCountForTissues } from 'js/api/scfind/useCellTypeCountForTissue';
import { decimal, percent } from 'js/helpers/number-format';
import ChartWrapper from 'js/shared-styles/charts/ChartWrapper';
import { useBandScale, useLinearScale, useOrdinalScale, useSymLogScale } from 'js/shared-styles/charts/hooks';
import { useChartPalette } from 'js/shared-styles/charts/HorizontalStackedBarChart/hooks';
import { TooltipData } from 'js/shared-styles/charts/types';
import VerticalStackedBarChart from 'js/shared-styles/charts/VerticalStackedBarChart';
import { LabeledPrimarySwitch } from 'js/shared-styles/switches';
import InfoTextTooltip from 'js/shared-styles/tooltips/InfoTextTooltip';
import React, { useMemo } from 'react';
import { formatCellTypeName } from 'js/api/scfind/utils';
import CellTypesDistributionChartContextProvider, {
  useCellTypesDistributionChartContext,
} from './CellTypesDistributionChartContext';
import { addPercentageToCellTypeCounts, categorizeCellTypeCounts, CellTypeCountWithPercentageAndOrgan } from './utils';

interface MultiOrganCellTypeDistributionChartProps {
  cellTypes: string[];
  organs: string[];
}

interface ChartData {
  organ: string;
  [key: string]: number | string;
}

function useCellTypeCountData(organs: string[], cellTypes: string[]) {
  const { showOtherCellTypes, showPercentages } = useCellTypesDistributionChartContext();
  const { data, isLoading } = useCellTypeCountForTissues(organs);

  const cellTypeNameKeys = useMemo(() => {
    const formattedCellTypes = cellTypes.map((name) => formatCellTypeName(name));
    if (!showOtherCellTypes) {
      return formattedCellTypes; // If showOtherCellTypes is false, return only the formatted cell types
    }
    return [...formattedCellTypes, 'Other Cell Types'];
  }, [cellTypes, showOtherCellTypes]);

  // Categorize the cell type counts for each organ based on the provided cell types
  const cellTypeCountsRecord = useMemo(() => {
    // The order of the cell type counts is determined by the order of the `organ` array
    const record: Record<string, CellTypeCountWithPercentageAndOrgan[]> = {};
    data?.forEach((item, idx) => {
      const organ = organs[idx];
      const totalCellCountForOrgan = item.cellTypeCounts.reduce((sum, count) => {
        // Only count the cell types that are in the `cellTypes` array if `showOtherCellTypes` is false
        if (!showOtherCellTypes && !cellTypes.includes(count.index)) {
          return sum;
        }
        return sum + count.cell_count;
      }, 0);
      record[organ] = addPercentageToCellTypeCounts(
        categorizeCellTypeCounts(item.cellTypeCounts, cellTypes),
        totalCellCountForOrgan,
        organ,
      );
      if (!showOtherCellTypes) {
        // Filter out the 'Other Cell Types' if showOtherCellTypes is false
        record[organ] = record[organ].filter((count) => count.name !== 'Other Cell Types');
      }
    });
    return record;
  }, [data, organs, cellTypes, showOtherCellTypes]);

  const maxCellCount = useMemo(() => {
    // Find the maximum cell count across all organs
    return Object.values(cellTypeCountsRecord).reduce((max, counts) => {
      const organMax = Math.max(...counts.map((count) => count.count));
      return Math.max(max, organMax);
    }, 0);
  }, [cellTypeCountsRecord]);

  const fullCellTypeData = useMemo(() => {
    return Object.values(cellTypeCountsRecord).flat();
  }, [cellTypeCountsRecord]);

  const visxData = useMemo(() => {
    // Transform the data into the format required by the VerticalStackedBarChart
    // e.g. [{
    //   organ: 'Heart',
    //   Cardiomyocyte: 100,
    //   'Other Cell Types': 100,
    // }]
    const transformedData = fullCellTypeData.reduce((acc: ChartData[], curr: CellTypeCountWithPercentageAndOrgan) => {
      const existingOrgan = acc.find((d) => d.organ === curr.organ);
      if (existingOrgan) {
        existingOrgan[curr.name] = showPercentages ? curr.percentage : curr.count;
      } else {
        const newOrganData: ChartData = { organ: curr.organ };
        newOrganData[curr.name] = showPercentages ? curr.percentage : curr.count;
        acc.push(newOrganData);
      }
      return acc;
    }, []);
    // The data for both organs has to have the same keys, so we need to ensure that all organs have the same cell type keys
    const normalizedData = transformedData.map((d) => {
      const completeData: ChartData = { organ: d.organ };
      cellTypeNameKeys.forEach((key) => {
        completeData[key] = d[key] || 0; // Ensure all keys are present, defaulting to 0 if not found
      });
      return completeData;
    });
    return normalizedData;
  }, [cellTypeNameKeys, fullCellTypeData, showPercentages]);

  return { cellTypeCountsRecord, maxCellCount, isLoading, cellTypeNameKeys, fullCellTypeData, visxData };
}

function TooltipContent({ tooltipData }: { tooltipData: TooltipData<ChartData> }) {
  const { bar } = tooltipData;
  const { showPercentages } = useCellTypesDistributionChartContext();
  if (!bar?.data) {
    return null; // Return null if no data is available
  }
  const formatter = showPercentages ? percent : decimal;
  return (
    <Stack direction="column" spacing={1}>
      <Typography variant="body2" fontWeight="bold">
        {bar?.data?.organ}
      </Typography>
      {Object.entries(bar?.data || {})
        .filter(([key]) => key !== 'organ')
        .map(([key, value]) => (
          <Typography key={key} variant="body2">
            {key}: {formatter.format(showPercentages ? Number(value) / 100 : Number(value))}
          </Typography>
        ))}
    </Stack>
  );
}

function MultiOrganCellTypeDistributionChart({ cellTypes, organs }: MultiOrganCellTypeDistributionChartProps) {
  const { fullCellTypeData, isLoading, cellTypeNameKeys, maxCellCount, visxData } = useCellTypeCountData(
    organs,
    cellTypes,
  );

  const { showPercentages, setShowPercentages, showOtherCellTypes, setShowOtherCellTypes } =
    useCellTypesDistributionChartContext();

  const chartPalette = useChartPalette();
  const colorScale = useOrdinalScale(cellTypeNameKeys, {
    domain: cellTypeNameKeys,
    range: chartPalette,
  });

  // Domain of total counts scale should be from 0 to the maximum cell count across all organs
  // Using a symmetric log scale to handle large ranges and ensure visibility of smaller counts
  // The domain's max value should be adjusted to be nicer by rounding it up to the nearest power of 10

  const totalCountsScale = useSymLogScale(
    fullCellTypeData.map((d) => d.count),
    {
      domain: [0, maxCellCount],
      zero: true,
    },
  );

  const percentageScale = useLinearScale(
    fullCellTypeData.map((d) => d.percentage),
    {
      nice: true,
      domain: [0, 100],
      round: true,
    },
  );

  const yScale = showPercentages ? percentageScale : totalCountsScale;

  const xScale = useBandScale(organs);

  if (isLoading) {
    return <Paper sx={{ px: 2 }}>Loading...</Paper>;
  }

  return (
    <Paper sx={{ px: 2, pb: 2 }}>
      <ChartWrapper
        colorScale={colorScale}
        dividersInLegend
        margin={{
          top: 20,
          right: 20,
          bottom: 50,
          left: 100,
        }}
        dropdown={<Typography variant="body1">Cell Types</Typography>}
        additionalControls={
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
          </Stack>
        }
      >
        <VerticalStackedBarChart
          visxData={visxData}
          colorScale={colorScale}
          yScale={yScale}
          xScale={xScale}
          getX={(d) => d.organ}
          keys={cellTypeNameKeys}
          margin={{
            top: 20,
            right: 20,
            bottom: 50,
            left: 100,
          }}
          xAxisLabel="Organs"
          yAxisLabel="Cell Count"
          xAxisTickLabels={organs}
          TooltipContent={TooltipContent}
          getTickValues={
            showPercentages
              ? undefined
              : (y) => {
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
          }
        />
      </ChartWrapper>
    </Paper>
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
