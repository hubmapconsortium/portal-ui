import { createContext, useContext } from 'js/helpers/context';
import React, { useCallback, PropsWithChildren, useMemo } from 'react';
import { useAccordionStepsStore } from '../AccordionSteps/store';

interface AccordionStepContextType {
  completeStep: (text: string) => void;
}

const AccordionStepContext = createContext<AccordionStepContextType>('Accordion Step Context');
export const useAccordionStep = () => useContext(AccordionStepContext);

interface AccordionStepProviderProps extends PropsWithChildren {
  index: number;
}

export default function AccordionStepProvider({ children, index }: AccordionStepProviderProps) {
  const { completeStep } = useAccordionStepsStore();

  const handleCompleteStep = useCallback(
    (text: string) => {
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
