import React from 'react';

import LogSliderWrapper from './LogSliderWrapper';

export default {
  title: 'Controls/LogSliderWrapper',
  component: LogSliderWrapper,
};

export const LogSliderWrapperStory = (args) => <LogSliderWrapper {...args} />;
LogSliderWrapperStory.args = {
  value: 1,
  minLog: -1,
  maxLog: 3,
};
