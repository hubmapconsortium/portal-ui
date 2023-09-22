import React, { ComponentProps, ComponentType, PropsWithChildren, useRef } from 'react';

import { createContext, useContext } from 'js/helpers/context';

import { createStore} from './store';

type TutorialContextType = ReturnType<typeof createStore>;

const TutorialContext = createContext<TutorialContextType>('TutorialContext');

interface TutorialProviderProps extends PropsWithChildren {
  tutorial_key: string;
}

export default function TutorialProvider({ children, tutorial_key }: TutorialProviderProps) {
  const store = useRef(createStore(tutorial_key));

  return <TutorialContext.Provider value={store.current}>{children}</TutorialContext.Provider>
}

export function withTutorialProvider<P extends React.JSX.IntrinsicAttributes>(
  Component: ComponentType<P>, 
  tutorial_key: string) {
  return (props: ComponentProps<typeof Component>) => (
    <TutorialProvider tutorial_key={tutorial_key}>
      <Component {...props} />
    </TutorialProvider>
  );
}

export const useTutorial = () => useContext(TutorialContext);
