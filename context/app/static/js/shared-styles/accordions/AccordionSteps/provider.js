import React from 'react';

import { Provider, createStore } from './store';

function AccordionStepsProvider({ children, ...rest }) {
  return <Provider createStore={() => createStore({ ...rest })}>{children}</Provider>;
}

export { AccordionStepsProvider };
