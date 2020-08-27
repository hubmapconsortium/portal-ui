import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Vega as ReactVega } from 'react-vega';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import useWindowSize from 'js/hooks/useWindowSize';
import theme from 'js/theme';

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
        labelAngle: '-50',
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
            mapped_data_types: { terms: { field: 'mapped_data_types.keyword' } },
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
      const { buckets } = data.aggregations.mapped_data_types;
      setAssayTypesData(buckets);
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

  const labelAngle = useMediaQuery('(min-width:1150px)') ? '-50' : '-65';

  useEffect(
    () =>
      setSpec((prevState) => {
        const temp = prevState.encoding;
        temp.x.axis.labelAngle = labelAngle;
        return { ...prevState, ...temp };
      }),
    [labelAngle],
  );

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
