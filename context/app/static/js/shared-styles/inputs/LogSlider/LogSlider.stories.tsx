import React, { ComponentProps, useState } from 'react';
import type { Meta } from '@storybook/react';

import { Slider } from 'js/shared-styles/inputs/Slider/Slider.stories';
import LogSliderComponent from './LogSlider';

const meta = {
  title: 'inputs/LogSlider',
  component: LogSliderComponent,
} satisfies Meta<typeof LogSliderComponent>;

export default meta;

export function LogSlider(args: ComponentProps<typeof LogSliderComponent>) {
  const [logValue, setLogValue] = useState(1);
  return <LogSliderComponent value={logValue} onChange={(e, val) => setLogValue(val as number)} {...args} />;
}
LogSlider.args = {
  ...Slider.args,
  minLog: -1,
  maxLog: 10,
};
LogSlider.storyName = 'LogSlider'; // needed for single story hoisting for multi word component names
