import React, { ComponentProps } from 'react';
import Paper from '@mui/material/Paper';

import ChartWrapper from 'js/shared-styles/charts/ChartWrapper';
import { useSelectedDropdownIndex } from 'js/shared-styles/dropdowns/DropdownListbox';
import HorizontalStackedBarChart from 'js/shared-styles/charts/HorizontalStackedBarChart';
import { useChartPalette } from 'js/shared-styles/charts/HorizontalStackedBarChart/hooks';
import { ChartArea } from 'js/shared-styles/charts/HorizontalStackedBarChart/style';
import { useBandScale, useLinearScale, useOrdinalScale } from 'js/shared-styles/charts/hooks';
import Skeleton from '@mui/material/Skeleton';
import { TooltipData } from 'js/shared-styles/charts/types';
import Typography from '@mui/material/Typography';
import { AnyD3Scale } from '@visx/scale';
import { getSearchURL } from 'js/components/organ/utils';
import HuBMAPDatasetsChartDropdown from '../HuBMAPDatasetsChartDropdown';
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
} from './queries';
import {
  AggregatedDatum,
  getKeysFromAggregatedData,
  useAggregatedChartData,
  useDatasetTypeMap,
  useOrganOrder,
  useSearchDataRange,
} from './hooks';

// Margins in figma are 32 pixels everywhere except the bottom
const margin = { top: 32, right: 32, bottom: 64, left: 32 };

const getOrgan = (d: AggregatedDatum) => d.organ as string;

function HuBMAPDatasetsChartTooltip({ tooltipData }: { tooltipData: TooltipData<AggregatedDatum> }) {
  if (!tooltipData.bar || !tooltipData.key) return null;
  return (
    <>
      <Typography variant="subtitle2" color="secondary">
        {tooltipData.bar.data.organ}
      </Typography>
      <Typography>{tooltipData.key}</Typography>
      <Typography variant="h3" component="p" color="textPrimary">
        {tooltipData.bar.data[tooltipData.key]}
      </Typography>
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

function HuBMAPDatasetsChart() {
  const colors = useChartPalette();
  const [selectedColorDataIndex, setSelectedColorDataIndex] = useSelectedDropdownIndex(0);

  const { organOrder } = useOrganOrder();

  const assayBuckets = useAggregatedChartData<AssaysQueryKey>(assayTypeQuery);
  const donorSexBuckets = useAggregatedChartData<DonorSexQueryKey>(donorSexQuery);
  const donorRaceBuckets = useAggregatedChartData<DonorRaceQueryKey>(donorRaceQuery);
  const analyteClassBuckets = useAggregatedChartData<AnalyteClassQueryKey>(analyteClassQuery);
  const processingStatusBuckets = useAggregatedChartData<ProcessingStatusQueryKey>(processingStatusQuery);

  const datasetTypeMap = useDatasetTypeMap();

  const range = useSearchDataRange();

  const colorOptions: ColorOption[] = [
    {
      key: 'assay_type',
      data: assayBuckets,
      dropdownLabel: 'Assay Type',
      keys: getKeysFromAggregatedData(assayBuckets),
      getBarHref: (d) => {
        const organTerms = [String(d.bar.data.organ)];
        return getSearchURL({
          entityType: 'Dataset',
          organTerms,
          assay: d.key,
          assayTypeMap: datasetTypeMap,
        });
      },
      getAriaLabel: (d) => {
        const organ = String(d?.bar?.data?.organ ?? '');
        const assay = d.key;
        const count = d.key ? d?.bar?.data[d.key] : null;
        if (count) return `${count} ${organ} datasets with assay type ${assay}.`;
        return `${organ} datasets with assay type ${assay}.`;
      },
    },
    {
      key: 'donor_sex',
      data: donorSexBuckets,
      dropdownLabel: 'Donor Sex',
      keys: getKeysFromAggregatedData(donorSexBuckets),
      getBarHref: (d) => {
        const organTerms = [String(d.bar.data.organ)];
        return getSearchURL({
          entityType: 'Dataset',
          organTerms,
          donorSex: d.key,
        });
      },
      getAriaLabel: (d) => {
        const organ = String(d?.bar?.data?.organ ?? '');
        const donorSex = d.key;
        const count = d.key ? d?.bar?.data[d.key] : null;
        if (count) return `${count} ${organ} datasets with donor sex ${donorSex}.`;
        return `${organ} datasets with donor sex ${donorSex}.`;
      },
    },
    {
      key: 'donor_race',
      data: donorRaceBuckets,
      dropdownLabel: 'Donor Race',
      keys: getKeysFromAggregatedData(donorRaceBuckets),
      getBarHref: (d) => {
        const organTerms = [String(d.bar.data.organ)];
        return getSearchURL({
          entityType: 'Dataset',
          organTerms,
          donorRace: d.key,
        });
      },
      getAriaLabel: (d) => {
        const organ = String(d?.bar?.data?.organ ?? '');
        const donorRace = d.key;
        const count = d.key ? d?.bar?.data[d.key] : null;
        if (count) return `${count} ${organ} datasets with donor race ${donorRace}.`;
        return `${organ} datasets with donor race ${donorRace}.`;
      },
    },
    {
      key: 'analyte_class',
      data: analyteClassBuckets,
      dropdownLabel: 'Analyte Class',
      keys: getKeysFromAggregatedData(analyteClassBuckets),
      getBarHref: (d) => {
        const organTerms = [String(d.bar.data.organ)];
        return getSearchURL({
          entityType: 'Dataset',
          organTerms,
          analyteClass: d.key,
        });
      },
      getAriaLabel: (d) => {
        const organ = String(d?.bar?.data?.organ ?? '');
        const analyteClass = d.key;
        const count = d.key ? d?.bar?.data[d.key] : null;
        if (count) return `${count} ${organ} datasets with analyte class ${analyteClass}.`;
        return `${organ} datasets with analyte class ${analyteClass}.`;
      },
    },
    {
      key: 'processing_status',
      data: processingStatusBuckets,
      dropdownLabel: 'Processing Status',
      keys: getKeysFromAggregatedData(processingStatusBuckets),
      getBarHref: (d) => {
        const organTerms = [String(d.bar.data.organ)];
        return getSearchURL({
          entityType: 'Dataset',
          organTerms,
          processingStatus: d.key,
        });
      },
      getAriaLabel: (d) => {
        const organ = String(d?.bar?.data?.organ ?? '');
        const processingStatus = d.key;
        const count = d.key ? d?.bar?.data[d.key] : null;
        if (count) return `${count} ${organ} datasets with ${processingStatus} status.`;
        return `${organ} datasets with ${processingStatus} status.`;
      },
    },
  ];

  const selectedColor = colorOptions[selectedColorDataIndex];

  const colorScale = useOrdinalScale(selectedColor.keys, { range: colors });
  const yScale = useBandScale(organOrder, { padding: 0.1 });
  const xScale = useLinearScale(range, { nice: true });

  const allKeys = colorOptions.flatMap((option) => option.keys);
  const allKeysScale = useOrdinalScale(allKeys, { range: colors });

  if (!selectedColor.data.length || !organOrder) return <Skeleton height="500px" />;

  return (
    <Paper sx={{ pr: 4 }}>
      <ChartArea>
        <ChartWrapper
          margin={margin}
          colorScale={colorScale}
          allKeysScale={allKeysScale}
          dropdown={
            <HuBMAPDatasetsChartDropdown
              colorDataOptions={colorOptions.map((c) => c.dropdownLabel)}
              selectedColorDataIndex={selectedColorDataIndex}
              setSelectedColorDataIndex={setSelectedColorDataIndex}
            />
          }
        >
          <HorizontalStackedBarChart<AggregatedDatum, typeof xScale, typeof yScale>
            visxData={selectedColor.data}
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
            getBarHref={selectedColor.getBarHref}
            getAriaLabel={selectedColor.getAriaLabel}
          />
        </ChartWrapper>
      </ChartArea>
    </Paper>
  );
}

export default HuBMAPDatasetsChart;
