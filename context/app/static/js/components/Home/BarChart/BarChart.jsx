import React from 'react';
import PropTypes from 'prop-types';
import { Vega as ReactVega } from 'react-vega';

function BarChart(props) {
  const { data, spec: partialSpec } = props;
  const spec = { ...partialSpec, data: { name: 'table' } };

  return <ReactVega spec={spec} data={{ table: data }} renderer="canvas" scaleFactor={1} />;
}

BarChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.exact({ doc_count: PropTypes.number, key: PropTypes.string })).isRequired,
  spec: PropTypes.exact({
    encoding: PropTypes.object,
    config: PropTypes.object,
    layer: PropTypes.array,
    width: PropTypes.number,
    height: PropTypes.number,
  }).isRequired,
};

export default BarChart;
