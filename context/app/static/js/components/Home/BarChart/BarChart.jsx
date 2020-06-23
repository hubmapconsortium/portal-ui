import React from 'react';
import { Vega as ReactVega } from 'react-vega';

function BarChart(props) {
  const { data, spec: partialSpec } = props;
  const spec = { ...partialSpec, data: { name: 'table' } };

  // eslint-disable-next-line prettier/prettier
  return <ReactVega spec={spec} data={{table: data}} renderer="canvas" scaleFactor={1} />;
}

export default BarChart;
