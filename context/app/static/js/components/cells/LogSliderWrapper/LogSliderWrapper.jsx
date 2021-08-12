import React from 'react';
import Slider from '@material-ui/core/Slider';

function powerOf10(value) {
  return (
    <>
      10<sup>{value}</sup>
    </>
  );
}

function LogSliderWrapper(props) {
  const { value, minLog, maxLog, setter, labelledby } = props;
  const marks = [...Array(1 + maxLog - minLog).keys()].map((k) => k + minLog);
  return (
    <Slider
      value={value}
      min={minLog}
      max={maxLog}
      valueLabelDisplay="auto"
      step={null} /* Constrains choices to the mark values. */
      valueLabelFormat={powerOf10}
      marks={marks.map((m) => ({
        value: m,
        label: powerOf10(m),
      }))}
      onChange={(e, val) => {
        setter(val);
      }}
      aria-labelledby={labelledby}
    />
  );
}

export default LogSliderWrapper;
