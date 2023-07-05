import React, { useState } from 'react';

import SliderComponent from './Slider';

export default {
  title: 'inputs/Slider',
  component: SliderComponent,
  argTypes: {
    severity: {
      options: ['warning', 'error', 'success', 'info'],
      control: { type: 'select' },
    },
  },
};

export function Slider(args) {
  const [height, setHeight] = useState(1);
  return <SliderComponent value={height} onChange={(e, val) => setHeight(val)} {...args} />;
}
Slider.args = {
  label: 'Height inches',
  helperText: 'Set height in inches',
  min: 0,
  max: 10,
};
Slider.storyName = 'Slider'; // needed for single story hoisting for multi word component names
