import React from 'react';
import PropTypes from 'prop-types';

import { Provider, createStore } from './store';

function TutorialProvider({ children, tutorial_key }) {
  return <Provider createStore={() => createStore(tutorial_key)}>{children}</Provider>;
}

export const withTutorialProvider = (Component, tutorial_key) =>
  function ({ ...props }) {
    return (
      <TutorialProvider tutorial_key={tutorial_key}>
        <Component {...props} />
      </TutorialProvider>
    );
  };

TutorialProvider.propTypes = {
  /**
     Key used for tracking. Should match the name of the feature the tutorial is used for.
    */
  tutorial_key: PropTypes.string.isRequired,
};

export default TutorialProvider;
