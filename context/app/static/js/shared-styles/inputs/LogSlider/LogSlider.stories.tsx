import React, { useState } from 'react';

import { Slider } from 'js/shared-styles/inputs/Slider/Slider.stories';
import LogSliderComponent from './LogSlider';

export default {
  title: 'inputs/LogSlider',
  component: LogSliderComponent,
};

export function LogSlider(args: any) {
  const [logValue, setLogValue] = useState(1);
  return <LogSliderComponent value={logValue} onChange={(e, val) => setLogValue(val as number)} {...args} />;
}
(LogSlider as any).args = {
  ...(Slider as any).args,
  minLog: -1,
  maxLog: 10,
};
LogSlider.storyName = 'LogSlider'; // needed for single story hoisting for multi word component names
