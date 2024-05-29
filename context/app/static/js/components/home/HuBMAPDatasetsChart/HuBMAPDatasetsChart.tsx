import React, { ComponentProps } from 'react';

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

const margin = { top: 40, right: 50, bottom: 100, left: 100 };

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
}

function getHrefRoot(organ: string | number) {
  return `/search?entity_type[0]=Dataset&origin_samples.mapped_organ[0]=${organ}`;
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
        const { organ } = d.bar.data;
        const assayType = d.key;
        // Dataset type links need to include all the subtypes
        const mappedDatasetTypes = datasetTypeMap[assayType] ?? [];
        const href = mappedDatasetTypes.reduce((acc, datasetType, idx) => {
          return `${acc}&raw_dataset_type_keyword-assay_display_name_keyword[${assayType}][${idx}]=${datasetType}`;
        }, getHrefRoot(organ));
        return href;
      },
    },
    {
      key: 'donor_sex',
      data: donorSexBuckets,
      dropdownLabel: 'Donor Sex',
      keys: getKeysFromAggregatedData(donorSexBuckets),
      getBarHref: (d) => {
        const { organ } = d.bar.data;
        const donorSex = d.key;
        const href = `/search?entity_type[0]=Dataset&origin_samples.mapped_organ[0]=${organ}&donor.mapped_metadata.sex[0]=${donorSex}`;
        return href;
      },
    },
    {
      key: 'donor_race',
      data: donorRaceBuckets,
      dropdownLabel: 'Donor Race',
      keys: getKeysFromAggregatedData(donorRaceBuckets),
      getBarHref: (d) => {
        const { organ } = d.bar.data;
        const donorRace = d.key;
        const href = `/search?entity_type[0]=Dataset&origin_samples.mapped_organ[0]=${organ}&donor.mapped_metadata.race[0]=${donorRace}`;
        return href;
      },
    },
    {
      key: 'analyte_class',
      data: analyteClassBuckets,
      dropdownLabel: 'Analyte Class',
      keys: getKeysFromAggregatedData(analyteClassBuckets),
      getBarHref: (d) => {
        const { organ } = d.bar.data;
        const analyteClass = d.key;
        const href = `/search?entity_type[0]=Dataset&origin_samples.mapped_organ[0]=${organ}&analyte_class[0]=${analyteClass}`;
        return href;
      },
    },
    {
      key: 'processing_status',
      data: processingStatusBuckets,
      dropdownLabel: 'Processing Status',
      keys: getKeysFromAggregatedData(processingStatusBuckets),
      getBarHref: (d) => {
        const { organ } = d.bar.data;
        const processingStatus = d.key;
        const href = `search?entity_type[0]=Dataset&origin_samples.mapped_organ[0]=${organ}&processing_status[0]=${processingStatus}`;
        return href;
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
          getY={getOrgan}
          xAxisLabel=""
          yAxisLabel="Organ"
          showTooltipAndHover
          TooltipContent={HuBMAPDatasetsChartTooltip}
          getBarHref={selectedColor.getBarHref}
        />
      </ChartWrapper>
    </ChartArea>
  );
}

export default HuBMAPDatasetsChart;
