import React, { useState } from 'react';

import LogSlider from './LogSlider';

export default {
  title: 'inputs/LogSlider',
  component: LogSlider,
};

export const LogSliderStory = (args) => {
  const [logValue, setLogValue] = useState(1);
  return <LogSlider value={logValue} setter={setLogValue} {...args} />;
};
LogSliderStory.args = {
  minLog: -1,
  maxLog: 3,
};
LogSliderStory.storyName = 'LogSlider'; // needed for single story hoisting for multi word component names
