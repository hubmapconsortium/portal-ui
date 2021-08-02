import React from 'react';

import Slider from '@material-ui/core/Slider';

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
      marks={marks.map((m) => ({
        value: m,
        label: (
          <>
            10<sup>{m}</sup>
          </>
        ),
      }))}
      onChange={(e, val) => {
        setter(val);
      }}
      aria-labelledby={labelledby}
    />
  );
}

export default LogSliderWrapper;
