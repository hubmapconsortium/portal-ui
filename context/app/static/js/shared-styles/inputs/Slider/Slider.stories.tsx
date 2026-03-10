import React, { ComponentProps, useState } from 'react';
import type { Meta } from '@storybook/react';

import SliderComponent from './Slider';

const meta = {
  title: 'inputs/Slider',
  component: SliderComponent,
} satisfies Meta<typeof SliderComponent>;

export default meta;

export function Slider(args: ComponentProps<typeof SliderComponent>) {
  const [height, setHeight] = useState(1);
  return <SliderComponent value={height} onChange={(e, val) => setHeight(val as number)} {...args} />;
}
Slider.args = {
  label: 'Height inches',
  helperText: 'Set height in inches',
  min: 0,
  max: 10,
};
Slider.storyName = 'Slider'; // needed for single story hoisting for multi word component names
