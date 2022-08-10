import React from 'react';

import Slider from 'js/shared-styles/inputs/Slider';

function MarkedSlider({ marks, ...rest }) {
  return <Slider step={null} marks={marks} /* Constrains choices to the mark values. */ {...rest} />;
}

export default MarkedSlider;
