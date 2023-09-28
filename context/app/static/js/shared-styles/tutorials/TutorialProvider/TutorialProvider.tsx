import React, { ComponentProps, ComponentType, PropsWithChildren, useRef } from 'react';

import { createContext } from 'js/helpers/context';

import { createStoreContextHook } from 'js/helpers/zustand';
import { createStore } from './store';

type TutorialContextType = ReturnType<typeof createStore>;

const TutorialContext = createContext<TutorialContextType>('TutorialContext');

interface TutorialProviderProps extends PropsWithChildren {
  tutorial_key: string;
}

export default function TutorialProvider({ children, tutorial_key }: TutorialProviderProps) {
  const store = useRef<TutorialContextType>();

  if (!store.current) {
    store.current = createStore(tutorial_key);
  }

  return <TutorialContext.Provider value={store.current}>{children}</TutorialContext.Provider>;
}

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

export const useTutorial = createStoreContextHook(TutorialContext);
