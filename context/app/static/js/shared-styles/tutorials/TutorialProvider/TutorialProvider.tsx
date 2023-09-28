import React, { ComponentProps, ComponentType } from 'react';

import { createStoreContext } from 'js/helpers/zustand';
import { createStore, TutorialStore } from './store';

const [TutorialContext, TutorialProvider, useTutorialStore] = createStoreContext<TutorialStore>(
  createStore,
  'Tutorial Store',
);

export function withTutorialProvider<P extends React.JSX.IntrinsicAttributes>(
  Component: ComponentType<P>,
  tutorial_key: string,
) {
  return function ComponentWithTutorialProvider(props: ComponentProps<typeof Component>) {
    return (
      <TutorialProvider tutorial_key={tutorial_key}>
        <Component {...props} />
      </TutorialProvider>
    );
  };
}

export default TutorialProvider;
export { useTutorialStore, TutorialContext };
