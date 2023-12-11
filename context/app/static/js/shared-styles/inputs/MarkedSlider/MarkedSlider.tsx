import React, { ComponentProps } from 'react';

import Slider from 'js/shared-styles/inputs/Slider';

function MarkedSlider({ marks, ...rest }: ComponentProps<typeof Slider>) {
  return <Slider step={null} marks={marks} /* Constrains choices to the mark values. */ {...rest} />;
}

export default MarkedSlider;
