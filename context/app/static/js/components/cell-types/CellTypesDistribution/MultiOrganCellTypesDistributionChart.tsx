import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ChartWrapper from 'js/shared-styles/charts/ChartWrapper';
import { useBandScale, useOrdinalScale, usePercentageYScaleFormat } from 'js/shared-styles/charts/hooks';
import { useChartPalette } from 'js/shared-styles/charts/HorizontalStackedBarChart/hooks';
import VerticalStackedBarChart from 'js/shared-styles/charts/VerticalStackedBarChart';
import { LabeledPrimarySwitch } from 'js/shared-styles/switches';
import InfoTextTooltip from 'js/shared-styles/tooltips/InfoTextTooltip';
import React, { useMemo } from 'react';
import { ScaleContinuousNumeric } from 'd3';
import Skeleton from '@mui/material/Skeleton';
import { unselectedCellColors } from 'js/components/cells/CellTypeDistributionChart/utils';
import { trackEvent } from 'js/helpers/trackers';
import { useLabelToCLIDMap } from 'js/api/scfind/useLabelToCLID';
import { useEventCallback } from '@mui/material/utils';
import { BarGroupBar, SeriesPoint } from '@visx/shape/lib/types';
import { useCellTypeCountData, useYScale } from './hooks';
import CellTypesDistributionChartContextProvider, {
  useCellTypesDistributionChartContext,
  CellTypeDataContextProvider,
} from './contexts';
import CellTypesDistributionChartTooltip from './CellTypesDistributionTooltip';
import { useOptionalCellTypesDetailPageContext } from '../CellTypesDetailPageContext';
import { ChartData } from './types';

interface MultiOrganCellTypeDistributionChartProps {
  cellTypes: string[];
  organs: string[];
  hideLegend?: boolean;
  hideLinks?: boolean;
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

  const cellTypeContext = useOptionalCellTypesDetailPageContext();

  const trackingInfo = cellTypeContext?.trackingInfo;

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
        onChange={(e) => {
          setShowPercentages(e.target.checked);
          if (trackingInfo) {
            trackEvent({
              ...trackingInfo,
              action: 'Cell Type Distribution / Toggle Graph Type',
            });
          }
        }}
        ariaLabel="Graph Type"
      />
      {cellTypeContext && (
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
          onChange={(e) => {
            setShowOtherCellTypes(e.target.checked);
            if (trackingInfo) {
              trackEvent({
                ...trackingInfo,
                action: 'Cell Type Distribution / Toggle Other Cell Types',
              });
            }
          }}
          ariaLabel="Show Other Cell Types"
        />
      )}

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
          onChange={(e) => {
            setSymLogScale(e.target.checked);
            if (trackingInfo) {
              trackEvent({
                ...trackingInfo,
                action: 'Cell Type Distribution / Toggle Scale Type',
              });
            }
          }}
          ariaLabel="Use Symmetric Log Scale"
        />
      )}
    </Stack>
  );
}

function getSymLogTickValues(y: ScaleContinuousNumeric<number, number>) {
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

const margin = {
  top: 20,
  right: 20,
  bottom: 50,
  left: 100,
};

function MultiOrganCellTypeDistributionChart({
  cellTypes,
  organs,
  hideLegend,
  hideLinks = false,
}: MultiOrganCellTypeDistributionChartProps) {
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

  const yAxisLabel = showPercentages ? 'Cell Fraction' : 'Cell Count';
  const yTickFormat = usePercentageYScaleFormat(showPercentages);

  const { labelToCLIDMap } = useLabelToCLIDMap(cellTypes);

  const getBarHref: (
    d: Omit<BarGroupBar<string>, 'value' | 'key'> & {
      bar: SeriesPoint<ChartData>;
      key: string;
    },
  ) => string | undefined = useEventCallback((d) => {
    if (hideLinks) {
      return undefined;
    }
    const { key, bar } = d;
    const fullKey = `${bar.data.organ}.${key}`;
    if (labelToCLIDMap[fullKey]) {
      return `/cell-types/${labelToCLIDMap[fullKey][0]}`;
    }
    return undefined;
  });

  if (isLoading) {
    return <Skeleton variant="rectangular" width="100%" height={500} />;
  }

  return (
    <CellTypeDataContextProvider value={{ cellTypeCounts: cellTypeCountsRecord, colorScale: combinedColorScale }}>
      <Paper sx={{ p: 2 }}>
        <ChartWrapper
          colorScale={hideLegend ? undefined : targetColorScale}
          dividersInLegend
          margin={margin}
          dropdown={hideLegend ? undefined : <Typography variant="body1">Cell Types</Typography>}
          additionalControls={<ChartControls />}
        >
          <VerticalStackedBarChart
            visxData={visxData}
            colorScale={combinedColorScale}
            yScale={yScale}
            xScale={xScale}
            getX={(d) => d.organ}
            keys={showOtherCellTypes ? allCellTypeKeys : targetCellTypeKeys}
            margin={margin}
            xAxisLabel="Organs"
            yAxisLabel={yAxisLabel}
            xAxisTickLabels={organs}
            TooltipContent={CellTypesDistributionChartTooltip}
            // @ts-expect-error Annoying type error with scale types
            getTickValues={getTickValues}
            yTickFormat={yTickFormat}
            getBarHref={getBarHref}
            order="ascending"
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
