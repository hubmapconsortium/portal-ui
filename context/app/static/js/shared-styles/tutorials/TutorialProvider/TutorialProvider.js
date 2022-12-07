import React from 'react';
import PropTypes from 'prop-types';

import { Provider, createStore } from './store';

function TutorialProvider({ children, localStorageKey }) {
  return <Provider createStore={() => createStore(localStorageKey)}>{children}</Provider>;
}

export const withTutorialProvider = (Component, localStorageKey) => ({ ...props }) => (
  <TutorialProvider localStorageKey={localStorageKey}>
    <Component {...props} />
  </TutorialProvider>
);

TutorialProvider.propTypes = {
  /**
     Key for localstorage used to track whether the tutorial prompt should be shown.
    */
  localStorageKey: PropTypes.string.isRequired,
};

export default TutorialProvider;
