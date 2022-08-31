import React from 'react';

import MarkedSlider from 'js/shared-styles/inputs/Slider';

function powerOf10(value) {
  return (
    <>
      10<sup>{value}</sup>
    </>
  );
}

function LogSlider({ minLog, maxLog, ...rest }) {
  const marks = [...Array(1 + maxLog - minLog).keys()].map((k) => k + minLog);
  return (
    <MarkedSlider
      min={minLog}
      max={maxLog}
      valueLabelFormat={powerOf10}
      marks={marks.map((m) => ({
        value: m,
        label: powerOf10(m),
      }))}
      {...rest}
    />
  );
}

export default LogSlider;
