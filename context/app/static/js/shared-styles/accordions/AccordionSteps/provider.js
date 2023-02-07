import React from 'react';

import { Provider, createStore } from './store';

function AccordionStepsProvider({ children, stepsLength }) {
  return <Provider createStore={() => createStore(stepsLength)}>{children}</Provider>;
}

export { AccordionStepsProvider };
