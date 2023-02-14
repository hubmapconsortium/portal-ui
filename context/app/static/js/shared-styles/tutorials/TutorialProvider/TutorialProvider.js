import React from 'react';
import PropTypes from 'prop-types';

import { Provider, createStore } from './store';

function TutorialProvider({ children, key }) {
  return <Provider createStore={() => createStore(key)}>{children}</Provider>;
}

export const withTutorialProvider = (Component, key) => ({ ...props }) => (
  <TutorialProvider key={key}>
    <Component {...props} />
  </TutorialProvider>
);

TutorialProvider.propTypes = {
  /**
     Key used for tracking. Should match the name of the feature the tutorial is used for.
    */
  key: PropTypes.string.isRequired,
};

export default TutorialProvider;
