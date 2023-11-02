import { createContext, useContext } from 'js/helpers/context';
import React, { useCallback, PropsWithChildren, useMemo, ReactElement } from 'react';
import {} from 'react-markdown/lib/react-markdown';
import { useAccordionStepsStore } from '../AccordionSteps/store';

interface AccordionStepContextType {
  completeStep: (text: string | ReactElement) => void;
}

const AccordionStepContext = createContext<AccordionStepContextType>('Accordion Step Context');
export const useAccordionStep = () => useContext(AccordionStepContext);

interface AccordionStepProviderProps extends PropsWithChildren {
  index: number;
}

export default function AccordionStepProvider({ children, index }: AccordionStepProviderProps) {
  const { completeStep } = useAccordionStepsStore();

  const handleCompleteStep = useCallback(
    (text: string | ReactElement) => {
      completeStep(index, text);
    },
    [completeStep, index],
  );

  const value = useMemo(
    () => ({
      completeStep: handleCompleteStep,
    }),
    [handleCompleteStep],
  );

  return <AccordionStepContext.Provider value={value}>{children}</AccordionStepContext.Provider>;
}
