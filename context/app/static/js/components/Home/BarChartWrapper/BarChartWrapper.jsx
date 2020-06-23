import React, { useState, useEffect } from 'react';
import { useTheme } from '@material-ui/core/styles';
// eslint-disable-next-line import/no-unresolved
import useWindowSize from 'hooks/useWindowSize';
import BarChart from '../BarChart';
import { Wrapper } from './style';

const dummyData = [
  { doc_count: 5, key: 'AF-bulk' },
  { doc_count: 10, key: 'ATACseq-bulk' },
  { doc_count: 22, key: 'MxIF' },
  { doc_count: 31, key: 'CODEX' },
  { doc_count: 2, key: 'IMC' },
  { doc_count: 14, key: 'MALDI-IMS-neg' },
  { doc_count: 19, key: 'MALDI-IMS-pos' },
  { doc_count: 7, key: 'PAS' },
  { doc_count: 23, key: 'bulk-RNA' },
  { doc_count: 4, key: 'SNAREseq' },
  { doc_count: 29, key: 'TMT-LC-MS' },
  { doc_count: 7, key: 'Targeted-Shotgun-LC-MS' },
  { doc_count: 12, key: 'LC-MS-untargeted' },
  { doc_count: 22, key: 'WGS' },
  { doc_count: 16, key: 'scRNA-Seq-10x' },
  { doc_count: 8, key: 'sciATACseq' },
];

function getChartDimensions(windowWidth) {
  const containerWidth = Math.min(windowWidth, 1200);
  const chartWidth = containerWidth - 200;
  return { width: chartWidth, height: chartWidth * 0.6 };
}

function BarChartWrapper(props) {
  const { elasticsearchEndpoint } = props;

  const [assayTypesData, setAssayTypesData] = useState(dummyData);
  const windowWidth = useWindowSize().width;
  const { width, height } = getChartDimensions(windowWidth);

  useEffect(() => {
    async function getAssayTypesData() {
      const response = await fetch(elasticsearchEndpoint, {
        method: 'POST',
        body: JSON.stringify({
          size: 0,
          aggs: {
            data_types: { terms: { field: 'data_types.keyword' } },
          },
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        console.error('Search API failed', response);
        return;
      }
      const data = await response.json();
      const { buckets } = data.aggregations.data_types;

      if (buckets.length > 0) setAssayTypesData(buckets);
    }
    getAssayTypesData();
  }, [elasticsearchEndpoint]);

  const theme = useTheme();

  const sharedAxisSpec = {
    titleFontWeight: 300,
    titleFontSize: 12,
    domainColor: 'lightgray',
    tickColor: 'lightgray',
    gridColor: 'lightgray',
    labelFontWeight: 300,
  };

  const partialSpec = {
    encoding: {
      x: {
        field: 'key',
        type: 'ordinal',
        axis: {
          labelAngle: '-75',
          ticks: true,
          labelOverlap: true,
          ...sharedAxisSpec,
        },
        scale: { paddingInner: 0.4 },
        title: 'ASSAY TYPE',
        sort: '-y',
      },
      y: {
        field: 'doc_count',
        type: 'quantitative',
        axis: {
          tickCount: 6,
          labelFontSize: 12,
          titlePadding: theme.spacing(2),
          ...sharedAxisSpec,
        },
        title: 'DATASETS',
      },
    },
    config: { background: theme.palette.background.main, bar: { color: theme.palette.success.light } },
    layer: [
      {
        mark: 'bar',
      },
      {
        mark: {
          type: 'text',
          align: 'center',
          baseline: 'middle',
          dy: -6,
          fontSize: 12,
          fontWeight: 300,
        },
        encoding: {
          text: { field: 'doc_count', type: 'quantitative' },
        },
      },
    ],
  };

  const spec = { ...partialSpec, width, height };

  return (
    <Wrapper>
      <BarChart data={assayTypesData} spec={spec} />
    </Wrapper>
  );
}

export default BarChartWrapper;
