import React from 'react';

import ChartWrapper from 'js/shared-styles/charts/ChartWrapper';
import useSearchData from 'js/hooks/useSearchData';
import { useSelectedDropdownIndex } from 'js/shared-styles/dropdowns/DropdownListbox';
import { useChartPalette, useAssayTypeBarChartData } from './hooks';
import { getAssayTypesCompositeAggsQuery, getColorScale, getDataTypeScale, getDocCountScale } from './utils';
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
  const colors = useChartPalette();
  const [selectedColorDataIndex, setSelectedColorDataIndex] = useSelectedDropdownIndex(0);

  const { searchData: organTypesData } = useSearchData(organTypesQuery);
  const organTypes = organTypesData?.aggregations?.organ_types.buckets.map((b) => b.key);

  const { searchData: assayOrganTypeData } = useSearchData(assayOrganTypesQuery);
  const { searchData: assayDonorSexData } = useSearchData(assayDonorSexQuery);

  const { formattedData: formattedOrganTypeData, maxSumDocCount: maxAssayOrganTypeDocCount } = useAssayTypeBarChartData(
    assayOrganTypeData,
    'organ_type',
    (bucket) => !bucket.key.mapped_data_type.includes('['),
  );

  const { formattedData: formattedDonorSexData, maxSumDocCount: maxAssayDonorSexDocCount } = useAssayTypeBarChartData(
    assayDonorSexData,
    'donor_sex',
    (bucket) => !bucket.key.mapped_data_type.includes('['),
  );

  const visxData = [formattedOrganTypeData, formattedDonorSexData];
  const maxSumDocCount = [maxAssayOrganTypeDocCount, maxAssayDonorSexDocCount];

  const docCountScale = getDocCountScale(maxSumDocCount[selectedColorDataIndex]);

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

  const colorScale = getColorScale(colorOptions[selectedColorDataIndex].values, colors);

  const dataTypes = visxData[selectedColorDataIndex].map((b) => b.mapped_data_type);

  const dataTypeScale = getDataTypeScale(dataTypes);

  const margin = { top: 40, right: 50, bottom: 100, left: 300 };

  return (
    <ChartArea>
      <ChartWrapper
        margin={margin}
        colorScale={colorScale}
        dropdown={
          <div>
            <AssayTypeBarChartDropdown
              colorDataOptions={colorOptions.map((color) => color.dropdownLabel)}
              selectedColorDataIndex={selectedColorDataIndex}
              setSelectedColorDataIndex={setSelectedColorDataIndex}
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
          colorFacetName={colorOptions[selectedColorDataIndex].facetName}
          margin={margin}
          dataTypes={dataTypes}
        />
      </ChartWrapper>
    </ChartArea>
  );
}

export default AssayTypeBarChartContainer;
