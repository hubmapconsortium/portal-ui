import React, { ComponentProps, RefObject, useEffect, useMemo } from 'react';
import Paper from '@mui/material/Paper';

import ChartWrapper from 'js/shared-styles/charts/ChartWrapper';
import { useSelectedDropdownIndex } from 'js/shared-styles/dropdowns/DropdownListbox';
import HorizontalStackedBarChart from 'js/shared-styles/charts/HorizontalStackedBarChart';
import { useChartPalette } from 'js/shared-styles/charts/HorizontalStackedBarChart/hooks';
import { ChartArea } from 'js/shared-styles/charts/HorizontalStackedBarChart/style';
import { useBandScale, useLinearScale, useOrdinalScale } from 'js/shared-styles/charts/hooks';
import Skeleton from '@mui/material/Skeleton';
import { trackEvent } from 'js/helpers/trackers';
import { TooltipData } from 'js/shared-styles/charts/types';
import Typography from '@mui/material/Typography';
import { AnyD3Scale } from '@visx/scale';
import { getSearchURL } from 'js/components/organ/utils';
import { SelectChangeEvent } from '@mui/material/Select';
import ChartDropdown from 'js/shared-styles/charts/ChartDropdown';
import {
  assayTypeQuery,
  donorSexQuery,
  analyteClassQuery,
  processingStatusQuery,
  AssaysQueryKey,
  DonorSexQueryKey,
  AnalyteClassQueryKey,
  ProcessingStatusQueryKey,
  donorRaceQuery,
  DonorRaceQueryKey,
  SELECTED_ENTITY_TYPES,
  useSelectedEntityType,
} from './queries';
import {
  AggregatedDatum,
  getKeysFromAggregatedData,
  useAggregatedChartData,
  useDatasetTypeMap,
  useOrganOrder,
  useSearchDataRange,
} from './hooks';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

// Margins in figma are 32 pixels everywhere except the bottom
const margin = { top: 32, right: 32, bottom: 32, left: 32 };

const getOrgan = (d: AggregatedDatum) => d.organ;

function HuBMAPDatasetsChartTooltip({ tooltipData }: { tooltipData: TooltipData<AggregatedDatum> }) {
  if (!tooltipData.bar || !tooltipData.key) return null;

  // Hovering a bar segment
  if (tooltipData.bar.data.data[tooltipData.key]) {
    return (
      <>
        <Typography variant="subtitle2" color="secondary">
          {tooltipData.bar.data.organ}
        </Typography>
        <Typography>{tooltipData.key}</Typography>
        <Typography variant="h3" component="p" color="textPrimary">
          {tooltipData.bar.data.data[tooltipData.key]}
        </Typography>
      </>
    );
  }

  const entries = Object.entries(tooltipData.bar.data.data);

  return (
    <>
      <Typography variant="subtitle2" color="secondary">
        {tooltipData.bar.data.organ}
      </Typography>
      <List dense disablePadding>
        {entries.map(([key, value]) => (
          <ListItem key={key} disablePadding>
            {key}: {value}
          </ListItem>
        ))}
      </List>
    </>
  );
}

interface ColorOption {
  key: string;
  data: AggregatedDatum[];
  dropdownLabel: string;
  keys: string[];
  getBarHref?: ComponentProps<typeof HorizontalStackedBarChart<AggregatedDatum, AnyD3Scale, AnyD3Scale>>['getBarHref'];
  getAriaLabel?: (d: TooltipData<AggregatedDatum>) => string;
}

interface HuBMAPDatasetsChartProps {
  getBarHrefOverride?: ColorOption['getBarHref'];
  chartRef?: RefObject<HTMLDivElement>;
  onSelectionChange?: (label: string) => void;
}

function HuBMAPDatasetsChart({ getBarHrefOverride, chartRef, onSelectionChange }: HuBMAPDatasetsChartProps) {
  const colors = useChartPalette();
  const [selectedColorDataIndex, setSelectedColorDataIndex] = useSelectedDropdownIndex(0);

  const { organOrder } = useOrganOrder();

  const { selectedEntityType, setSelectedEntityType } = useSelectedEntityType();

  const assayBuckets = useAggregatedChartData<AssaysQueryKey>(assayTypeQuery, selectedEntityType);
  const donorSexBuckets = useAggregatedChartData<DonorSexQueryKey>(donorSexQuery, selectedEntityType);
  const donorRaceBuckets = useAggregatedChartData<DonorRaceQueryKey>(donorRaceQuery, selectedEntityType);
  const analyteClassBuckets = useAggregatedChartData<AnalyteClassQueryKey>(analyteClassQuery, selectedEntityType);
  const processingStatusBuckets = useAggregatedChartData<ProcessingStatusQueryKey>(
    processingStatusQuery,
    selectedEntityType,
  );

  const datasetTypeMap = useDatasetTypeMap();

  const range = useSearchDataRange(selectedEntityType);

  const colorOptions: ColorOption[] = useMemo(
    () => [
      {
        key: 'assay_type',
        data: assayBuckets,
        dropdownLabel: 'Assay Type',
        keys: getKeysFromAggregatedData(assayBuckets),
        getBarHref:
          selectedEntityType === 'Dataset'
            ? (d) => {
                const organTerms = [String(d.bar.data.organ)];
                return getSearchURL({
                  entityType: 'Dataset',
                  organTerms,
                  assay: d.key,
                  assayTypeMap: datasetTypeMap,
                });
              }
            : undefined,
        getAriaLabel: (d) => {
          const organ = String(d?.bar?.data?.organ ?? '');
          const assay = d.key;
          const count = d.key ? d?.bar?.data?.data[d.key] : null;
          if (count) return `${count} ${organ} datasets with assay type ${assay}.`;
          return `${organ} datasets with assay type ${assay}.`;
        },
      },
      {
        key: 'donor_sex',
        data: donorSexBuckets,
        dropdownLabel: 'Donor Sex',
        keys: getKeysFromAggregatedData(donorSexBuckets),
        getBarHref:
          selectedEntityType === 'Dataset'
            ? (d) => {
                const organTerms = [String(d.bar.data.organ)];
                return getSearchURL({
                  entityType: 'Dataset',
                  organTerms,
                  donorSex: d.key,
                });
              }
            : undefined,
        getAriaLabel: (d) => {
          const organ = String(d?.bar?.data?.organ ?? '');
          const donorSex = d.key;
          const count = d.key ? d?.bar?.data?.data[d.key] : null;
          if (count) return `${count} ${organ} datasets with donor sex ${donorSex}.`;
          return `${organ} datasets with donor sex ${donorSex}.`;
        },
      },
      {
        key: 'donor_race',
        data: donorRaceBuckets,
        dropdownLabel: 'Donor Race',
        keys: getKeysFromAggregatedData(donorRaceBuckets),
        getBarHref:
          selectedEntityType === 'Dataset'
            ? (d) => {
                const organTerms = [String(d.bar.data.organ)];
                return getSearchURL({
                  entityType: 'Dataset',
                  organTerms,
                  donorRace: d.key,
                });
              }
            : undefined,
        getAriaLabel: (d) => {
          const organ = String(d?.bar?.data?.organ ?? '');
          const donorRace = d.key;
          const count = d.key ? d?.bar?.data?.data[d.key] : null;
          if (count) return `${count} ${organ} datasets with donor race ${donorRace}.`;
          return `${organ} datasets with donor race ${donorRace}.`;
        },
      },
      {
        key: 'analyte_class',
        data: analyteClassBuckets,
        dropdownLabel: 'Analyte Class',
        keys: getKeysFromAggregatedData(analyteClassBuckets),
        getBarHref:
          selectedEntityType === 'Dataset'
            ? (d) => {
                const organTerms = [String(d.bar.data.organ)];
                return getSearchURL({
                  entityType: 'Dataset',
                  organTerms,
                  analyteClass: d.key,
                });
              }
            : undefined,
        getAriaLabel: (d) => {
          const organ = String(d?.bar?.data?.organ ?? '');
          const analyteClass = d.key;
          const count = d.key ? d?.bar?.data?.data[d.key] : null;
          if (count) return `${count} ${organ} datasets with analyte class ${analyteClass}.`;
          return `${organ} datasets with analyte class ${analyteClass}.`;
        },
      },
      {
        key: 'processing_status',
        data: processingStatusBuckets,
        dropdownLabel: 'Processing Status',
        keys: getKeysFromAggregatedData(processingStatusBuckets),
        getBarHref:
          selectedEntityType === 'Dataset'
            ? (d) => {
                const organTerms = [String(d.bar.data.organ)];
                return getSearchURL({
                  entityType: 'Dataset',
                  organTerms,
                  processingStatus: d.key,
                });
              }
            : undefined,
        getAriaLabel: (d) => {
          const organ = String(d?.bar?.data?.organ ?? '');
          const processingStatus = d.key;
          const count = d.key ? d?.bar?.data?.data[d.key] : null;
          if (count) return `${count} ${organ} datasets with ${processingStatus} status.`;
          return `${organ} datasets with ${processingStatus} status.`;
        },
      },
    ],
    [
      assayBuckets,
      selectedEntityType,
      donorSexBuckets,
      donorRaceBuckets,
      analyteClassBuckets,
      processingStatusBuckets,
      datasetTypeMap,
    ],
  );

  const selectedColor = colorOptions[selectedColorDataIndex];

  const colorDomain = useMemo(() => {
    const editedDomain = [
      ...colorOptions[selectedColorDataIndex].keys
        .reduce((acc, curr) => {
          if (curr.includes(', ')) {
            const split = curr.split(', ');
            acc.add('Multiple');
            split.forEach((s) => {
              acc.add(s);
            });
          } else {
            acc.add(curr);
          }
          return acc;
        }, new Set<string>())
        .values(),
    ].sort();
    return editedDomain;
  }, [selectedColorDataIndex, colorOptions]);

  const colorScale = useOrdinalScale(colorDomain, { range: colors });
  const yScale = useBandScale(organOrder, { padding: 0.1 });
  const xScale = useLinearScale(range, { nice: true });

  const allKeys = useMemo(
    () =>
      colorOptions
        .flatMap((option) => option.keys)
        .map((d) => {
          if (d.includes(', ')) {
            return 'Multiple';
          }
          return d;
        })
        .filter((d, idx, arr) => arr.indexOf(d) === idx)
        .sort(),
    [colorOptions],
  );
  const allKeysScale = useOrdinalScale(allKeys, { range: colors });

  useEffect(() => {
    onSelectionChange?.(`${selectedEntityType} vs ${selectedColor.dropdownLabel}`);
  }, [selectedEntityType, selectedColor.dropdownLabel, onSelectionChange]);

  if (!selectedColor.data.length || !organOrder) return <Skeleton height="500px" />;
  return (
    <Paper sx={{ px: 2 }} ref={chartRef}>
      <ChartArea>
        <ChartWrapper
          margin={margin}
          colorScale={colorScale}
          allKeysScale={allKeysScale}
          dropdown={
            <ChartDropdown
              options={colorOptions.map((c) => c.dropdownLabel)}
              value={selectedColor.dropdownLabel}
              label="Compare by"
              onChange={(e: SelectChangeEvent) => {
                setSelectedColorDataIndex(colorOptions.findIndex((c) => c.dropdownLabel === e.target.value));
              }}
              fullWidth
            />
          }
          xAxisDropdown={
            <ChartDropdown
              options={SELECTED_ENTITY_TYPES}
              value={selectedEntityType}
              label="X-Axis"
              fullWidth
              onChange={(e: SelectChangeEvent) => {
                setSelectedEntityType(e.target.value as (typeof SELECTED_ENTITY_TYPES)[number]);
              }}
              action="HuBMAP Datasets Graph/X-Axis Selection"
            />
          }
        >
          <HorizontalStackedBarChart<AggregatedDatum, typeof xScale, typeof yScale>
            visxData={selectedColor.data.map((d) => ({
              ...d,
              ...d.data,
            }))}
            xScale={xScale}
            yScale={yScale}
            yAxisTickLabels={organOrder}
            keys={selectedColor.keys}
            margin={margin}
            colorScale={colorScale}
            xAxisLabel="Number of Datasets"
            yAxisLabel="Organ"
            srOnlyLabels
            getY={getOrgan}
            showTooltipAndHover
            TooltipContent={HuBMAPDatasetsChartTooltip}
            onBarClick={(d) => {
              trackEvent({
                category: 'Homepage',
                action: 'HuBMAP Datasets Graph/Bar Links',
                label: `${d.bar.data.organ} ${d.key}`,
              });
            }}
            getBarHref={getBarHrefOverride ?? selectedColor.getBarHref}
            getAriaLabel={selectedColor.getAriaLabel}
            canBeMultipleKeys
          />
        </ChartWrapper>
      </ChartArea>
    </Paper>
  );
}

export default HuBMAPDatasetsChart;
