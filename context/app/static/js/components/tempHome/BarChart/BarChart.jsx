import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Vega as ReactVega } from 'react-vega';
/* eslint-disable import/no-unresolved */
import useWindowSize from 'hooks/useWindowSize';
import theme from 'theme';
/* eslint-enable */

const dummyData = [
  { doc_count: 51, key: 'FAKE-AF-bulk' },
  { doc_count: 50, key: 'FAKE-ATACseq-bulk' },
  { doc_count: 50, key: 'FAKE-MxIF' },
  { doc_count: 40, key: 'FAKE-CODEX' },
  { doc_count: 40, key: 'FAKE-IMC' },
  { doc_count: 40, key: 'FAKE-MALDI-IMS-neg' },
  { doc_count: 30, key: 'FAKE-MALDI-IMS-pos' },
  { doc_count: 30, key: 'FAKE-PAS' },
  { doc_count: 30, key: 'FAKE-bulk-RNA' },
  { doc_count: 20, key: 'FAKE-SNAREseq' },
  { doc_count: 20, key: 'FAKE-TMT-LC-MS' },
  { doc_count: 20, key: 'FAKE-Targeted-Shotgun-LC-MS' },
  { doc_count: 10, key: 'FAKE-LC-MS-untargeted' },
  { doc_count: 10, key: 'FAKE-WGS' },
  { doc_count: 10, key: 'FAKE-scRNA-Seq-10x' },
  { doc_count: 5, key: 'FAKE-sciATACseq' },
];

const sharedAxisSpec = {
  titleFontWeight: 300,
  titleFontSize: 12,
  domainColor: 'lightgray',
  tickColor: 'lightgray',
  gridColor: 'lightgray',
  labelFontWeight: 300,
};

const partialSpec = {
  height: 'container',
  autosize: {
    type: 'fit',
    contains: 'padding',
  },
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

function BarChart(props) {
  const { elasticsearchEndpoint } = props;
  const [assayTypesData, setAssayTypesData] = useState([]);

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

      if (buckets.length > 0) {
        setAssayTypesData(buckets);
      } else {
        setAssayTypesData(dummyData);
      }
    }
    getAssayTypesData();
  }, [elasticsearchEndpoint]);

  const windowDimensions = useWindowSize();
  const [spec, setSpec] = useState({});
  const [style, setStyle] = useState({});

  useEffect(() => {
    const chartWidth = Math.min(windowDimensions.width - (38 + 48), 1050); // 38 = padding for vega button, 48 = container padding
    setSpec({ ...partialSpec, width: chartWidth });
    setStyle({ maxHeight: 790, gridArea: 'bar', width: chartWidth + 38 }); // 38 = padding for vega button
  }, [windowDimensions]);

  return (
    <ReactVega
      spec={{ ...spec, data: { name: 'table' } }}
      data={{ table: assayTypesData }}
      renderer="canvas"
      style={style}
      scaleFactor={1}
      forceRerender={windowDimensions}
    />
  );
}

BarChart.propTypes = {
  elasticsearchEndpoint: PropTypes.string.isRequired,
};

export default BarChart;
