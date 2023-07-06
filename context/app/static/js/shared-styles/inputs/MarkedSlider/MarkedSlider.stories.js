import React, { useState } from 'react';

import { Slider } from 'js/shared-styles/inputs/Slider/Slider.stories';
import MarkedSliderComponent from './MarkedSlider';

export default {
  title: 'inputs/MarkedSlider',
  component: MarkedSliderComponent,
};

export function MarkedSlider(args) {
  const [height, setHeight] = useState(1);
  return <MarkedSliderComponent value={height} onChange={(e, val) => setHeight(val)} {...args} />;
}
MarkedSlider.args = {
  ...Slider.args,
  marks: [0, 1, 2, 5, 10].map((m) => ({ value: m, label: m })),
};
MarkedSlider.storyName = 'MarkedSlider'; // needed for single story hoisting for multi word component names
