import React from 'react';

// import ChartWrapper from 'js/shared-styles/charts/ChartWrapper';
import useSearchData from 'js/hooks/useSearchData';
import { useSelectedDropdownIndex } from 'js/shared-styles/dropdowns/DropdownListbox';
// import HorizontalStackedBarChart from 'js/shared-styles/charts/HorizontalStackedBarChart';
import { useChartPalette } from 'js/shared-styles/charts/HorizontalStackedBarChart/hooks';
import { ChartArea } from 'js/shared-styles/charts/HorizontalStackedBarChart/style';
// import HuBMAPDatasetsChartDropdown from '../HuBMAPDatasetsChartDropdown';
import {
  organTypesQuery,
  techniquesQuery,
  donorSexQuery,
  molecularEntityQuery,
  processingStatusQuery,
  TechniquesQueryKey,
  DonorSexQueryKey,
  MolecularEntityQueryKey,
  ProcessingStatusQueryKey,
} from './queries';
import { useAggregatedChartData } from './hooks';

function HuBMAPDatasetsChart() {
  const colors = useChartPalette();
  const [selectedColorDataIndex, setSelectedColorDataIndex] = useSelectedDropdownIndex(0);

  const { searchData: organData } = useSearchData(organTypesQuery);

  const techniqueBuckets = useAggregatedChartData<TechniquesQueryKey>(techniquesQuery, 'dataset_type');
  const donorSexBuckets = useAggregatedChartData<DonorSexQueryKey>(donorSexQuery, 'donor_sex');
  const molecularEntityBuckets = useAggregatedChartData<MolecularEntityQueryKey>(
    molecularEntityQuery,
    'molecular_entity',
  );
  const processingStatusBuckets = useAggregatedChartData<ProcessingStatusQueryKey>(
    processingStatusQuery,
    'processing_status',
  );

  console.log({ techniqueBuckets, donorSexBuckets, molecularEntityBuckets, processingStatusBuckets });

  const margin = { top: 40, right: 50, bottom: 100, left: 300 };

  return (
    <ChartArea>
      {/* <ChartWrapper
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
      </ChartWrapper> */}
    </ChartArea>
  );
}

export default HuBMAPDatasetsChart;
