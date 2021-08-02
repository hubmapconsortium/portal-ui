import React, { useState } from 'react';

import LogSliderWrapper from './LogSliderWrapper';

export default {
  title: 'Controls/LogSliderWrapper',
  component: LogSliderWrapper,
};

export const LogSliderWrapperStory = (args) => {
  const [logValue, setLogValue] = useState(1);
  return <LogSliderWrapper value={logValue} setter={setLogValue} {...args} />;
};
LogSliderWrapperStory.args = {
  minLog: -1,
  maxLog: 3,
};
