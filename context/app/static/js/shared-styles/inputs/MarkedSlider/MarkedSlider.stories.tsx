import React, { ComponentProps, useState } from 'react';
import type { Meta } from '@storybook/react';

import { Slider } from 'js/shared-styles/inputs/Slider/Slider.stories';
import MarkedSliderComponent from './MarkedSlider';

const meta = {
  title: 'inputs/MarkedSlider',
  component: MarkedSliderComponent,
} satisfies Meta<typeof MarkedSliderComponent>;

export default meta;

export function MarkedSlider(args: ComponentProps<typeof MarkedSliderComponent>) {
  const [height, setHeight] = useState(1);
  return <MarkedSliderComponent value={height} onChange={(e, val) => setHeight(val as number)} {...args} />;
}
MarkedSlider.args = {
  ...Slider.args,
  marks: [0, 1, 2, 5, 10].map((m) => ({ value: m, label: m })),
};
MarkedSlider.storyName = 'MarkedSlider'; // needed for single story hoisting for multi word component names
