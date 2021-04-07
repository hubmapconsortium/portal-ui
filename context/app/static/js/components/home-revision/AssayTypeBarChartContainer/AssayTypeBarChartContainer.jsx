import React, { useContext, useState } from 'react';
import { scaleLinear, scaleOrdinal, scaleBand } from '@visx/scale';
import { LegendOrdinal } from '@visx/legend';

import { AppContext } from 'js/components/Providers';
import useSearchData from 'js/hooks/useSearchData';
import { useChartPalette, useAssayTypeBarChartData } from './hooks';
import { getAssayTypesCompositeAggsQuery } from './utils';
import AssayTypeBarChart from '../AssayTypeBarChart/AssayTypeBarChart';
import { Flex, ChartWrapper, LegendWrapper } from './style';
import AssayTypeBarChartDropdown from '../AssayTypeBarChartDropdown';

const organTypesQuery = {
  size: 0,
  aggs: {
    organ_types: { terms: { field: 'origin_sample.mapped_organ.keyword', size: 10000 } },
  },
};

const assayOrganTypesQuery = getAssayTypesCompositeAggsQuery('origin_sample.mapped_organ.keyword', 'organ_type');
const assayDonorSexQuery = getAssayTypesCompositeAggsQuery('donor.mapped_metadata.sex.keyword', 'donor_sex');

function AssayTypeBarChartContainer() {
  const { elasticsearchEndpoint, nexusToken } = useContext(AppContext);
  const [selectedColorDataIndex, setSelectedColorDataIndex] = useState(0);

  function selectDropdownItem(itemAndIndex) {
    const { i } = itemAndIndex;
    setSelectedColorDataIndex(i);
  }
  const colors = useChartPalette();

  const { searchData: organTypesData } = useSearchData(organTypesQuery, elasticsearchEndpoint, nexusToken);
  const organTypes = organTypesData?.aggregations?.organ_types.buckets.map((b) => b.key);

  const { searchData: assayOrganTypeData } = useSearchData(assayOrganTypesQuery, elasticsearchEndpoint, nexusToken);
  const { searchData: assayDonorSexData } = useSearchData(assayDonorSexQuery, elasticsearchEndpoint, nexusToken);

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

  const colorData = [organTypes, ['Male', 'Female']];

  const docCountScale = scaleLinear({
    domain: [0, maxSumDocCount[selectedColorDataIndex]],
    nice: true,
  });

  const colorScale = scaleOrdinal({
    domain: colorData[selectedColorDataIndex],
    range: colors,
  });

  const dataTypeScale = scaleBand({
    domain: visxData[selectedColorDataIndex].map((b) => b.mapped_data_type),
    padding: 0.2,
  });

  const margin = { top: 40, right: 50, bottom: 100, left: 300 };

  return (
    <Flex>
      <ChartWrapper>
        <AssayTypeBarChart
          visxData={visxData[selectedColorDataIndex]}
          docCountScale={docCountScale}
          colorScale={colorScale}
          dataTypeScale={dataTypeScale}
          keys={colorData[selectedColorDataIndex]}
          margin={margin}
        />
      </ChartWrapper>
      <LegendWrapper marginTop={margin.top}>
        <AssayTypeBarChartDropdown
          colorDataOptions={[{ name: 'Organ Type' }, { name: 'Donor Sex' }]}
          selectedColorDataIndex={selectedColorDataIndex}
          setSelectedColorDataIndex={selectDropdownItem}
        />
        <LegendOrdinal
          scale={colorScale}
          itemMargin={1.5}
          shapeStyle={() => ({
            borderRadius: '3px',
          })}
        />
      </LegendWrapper>
    </Flex>
  );
}

export default AssayTypeBarChartContainer;
