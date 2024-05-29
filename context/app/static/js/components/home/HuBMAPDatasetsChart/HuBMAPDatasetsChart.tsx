import React from 'react';

import ChartWrapper from 'js/shared-styles/charts/ChartWrapper';
import { useSelectedDropdownIndex } from 'js/shared-styles/dropdowns/DropdownListbox';
import HorizontalStackedBarChart from 'js/shared-styles/charts/HorizontalStackedBarChart';
import { useChartPalette } from 'js/shared-styles/charts/HorizontalStackedBarChart/hooks';
import { ChartArea } from 'js/shared-styles/charts/HorizontalStackedBarChart/style';
import { useBandScale, useLinearScale, useOrdinalScale } from 'js/shared-styles/charts/hooks';
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
} from './queries';
import {
  AggregatedDatum,
  getKeysFromAggregatedData,
  useAggregatedChartData,
  useOrganOrder,
  useSearchDataRange,
} from './hooks';

const margin = { top: 40, right: 50, bottom: 100, left: 100 };

const getOrgan = (d: AggregatedDatum) => d.organ as string;

function HuBMAPDatasetsChart() {
  const colors = useChartPalette();
  const [selectedColorDataIndex, setSelectedColorDataIndex] = useSelectedDropdownIndex(0);

  const { organOrder } = useOrganOrder();

  const assayBuckets = useAggregatedChartData<AssaysQueryKey>(assayTypeQuery);
  const donorSexBuckets = useAggregatedChartData<DonorSexQueryKey>(donorSexQuery);
  const molecularEntityBuckets = useAggregatedChartData<AnalyteClassQueryKey>(analyteClassQuery);
  const processingStatusBuckets = useAggregatedChartData<ProcessingStatusQueryKey>(processingStatusQuery);

  const range = useSearchDataRange();

  const colorOptions = [
    {
      key: 'assay_type',
      data: assayBuckets,
      dropdownLabel: 'Technique',
      keys: getKeysFromAggregatedData(assayBuckets),
      range,
    },
    {
      key: 'donor_sex',
      data: donorSexBuckets,
      dropdownLabel: 'Donor Sex',
      keys: getKeysFromAggregatedData(donorSexBuckets),
      range,
    },
    {
      key: 'analyte_class',
      data: molecularEntityBuckets,
      dropdownLabel: 'Molecular Entity',
      keys: getKeysFromAggregatedData(molecularEntityBuckets),
      range,
    },
    {
      key: 'processing_status',
      data: processingStatusBuckets,
      dropdownLabel: 'Processing Status',
      keys: getKeysFromAggregatedData(processingStatusBuckets),
      range,
    },
  ];

  const selectedColor = colorOptions[selectedColorDataIndex];

  const colorScale = useOrdinalScale(selectedColor.keys, { range: colors });
  const yScale = useBandScale(organOrder, { padding: 0.1 });
  const xScale = useLinearScale(selectedColor.range, { nice: true });

  if (!selectedColor.data || !organOrder) return null;

  return (
    <ChartArea>
      <ChartWrapper
        margin={margin}
        colorScale={colorScale}
        dropdown={
          <HuBMAPDatasetsChartDropdown
            colorDataOptions={colorOptions.map((color) => color.dropdownLabel)}
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
        />
      </ChartWrapper>
    </ChartArea>
  );
}

export default HuBMAPDatasetsChart;
