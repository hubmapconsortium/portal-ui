import React, { useState } from 'react';
import { scaleLinear, scaleOrdinal, scaleBand } from '@visx/scale';

import ChartWrapper from 'js/shared-styles/charts/ChartWrapper';
import useSearchData from 'js/hooks/useSearchData';
import { useChartPalette, useAssayTypeBarChartData } from './hooks';
import { getAssayTypesCompositeAggsQuery } from './utils';
import AssayTypeBarChart from '../AssayTypeBarChart/AssayTypeBarChart';
import AssayTypeBarChartDropdown from '../AssayTypeBarChartDropdown';
import { ChartArea } from './style';

const organTypesQuery = {
  size: 0,
  aggs: {
    organ_types: { terms: { field: 'origin_sample.mapped_organ.keyword', size: 10000 } },
  },
};

const assayOrganTypesQuery = getAssayTypesCompositeAggsQuery('origin_sample.mapped_organ.keyword', 'organ_type');
const assayDonorSexQuery = getAssayTypesCompositeAggsQuery('donor.mapped_metadata.sex.keyword', 'donor_sex');

function AssayTypeBarChartContainer() {
  const [selectedColorDataIndex, setSelectedColorDataIndex] = useState(0);

  function selectDropdownItem(itemAndIndex) {
    const { i } = itemAndIndex;
    setSelectedColorDataIndex(i);
  }
  const colors = useChartPalette();

  const { searchData: organTypesData } = useSearchData(organTypesQuery);
  const organTypes = organTypesData?.aggregations?.organ_types.buckets.map((b) => b.key);

  const { searchData: assayOrganTypeData } = useSearchData(assayOrganTypesQuery);
  const { searchData: assayDonorSexData } = useSearchData(assayDonorSexQuery);

  const { formattedData: formattedOrganTypeData, maxSumDocCount: maxAssayOrganTypeDocCount } = useAssayTypeBarChartData(
    assayOrganTypeData,
    'organ_type',
  );

  const { formattedData: formattedDonorSexData, maxSumDocCount: maxAssayDonorSexDocCount } = useAssayTypeBarChartData(
    assayDonorSexData,
    'donor_sex',
  );

  const visxData = [formattedOrganTypeData, formattedDonorSexData];
  const maxSumDocCount = [maxAssayOrganTypeDocCount, maxAssayDonorSexDocCount];

  const docCountScale = scaleLinear({
    domain: [0, maxSumDocCount[selectedColorDataIndex]],
    nice: true,
  });

  const colorOptions = [
    {
      dropdownLabel: { name: 'Organ Type' },
      facetName: 'origin_sample.mapped_organ',
      values: organTypes,
    },
    {
      dropdownLabel: { name: 'Donor Sex' },
      facetName: 'donor.mapped_metadata.sex',
      values: ['Male', 'Female'],
    },
  ];

  const colorScale = scaleOrdinal({
    domain: colorOptions[selectedColorDataIndex].values,
    range: colors,
  });

  const dataTypeScale = scaleBand({
    domain: visxData[selectedColorDataIndex].map((b) => b.mapped_data_type),
    padding: 0.2,
  });

  const margin = { top: 40, right: 50, bottom: 100, left: 300 };

  return (
    <ChartArea>
      <ChartWrapper
        chartTitle=""
        margin={margin}
        colorScale={colorScale}
        dropdown={
          <div>
            <AssayTypeBarChartDropdown
              colorDataOptions={colorOptions.map((color) => color.dropdownLabel)}
              selectedColorDataIndex={selectedColorDataIndex}
              setSelectedColorDataIndex={selectDropdownItem}
            />
          </div>
        }
      >
        <AssayTypeBarChart
          visxData={visxData[selectedColorDataIndex]}
          docCountScale={docCountScale}
          colorScale={colorScale}
          dataTypeScale={dataTypeScale}
          keys={colorOptions[selectedColorDataIndex].values}
          selectedColorFacetName={colorOptions[selectedColorDataIndex].facetName}
          margin={margin}
        />
      </ChartWrapper>
    </ChartArea>
  );
}

export default AssayTypeBarChartContainer;
