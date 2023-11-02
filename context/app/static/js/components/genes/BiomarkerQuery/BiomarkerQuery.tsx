import CellsResults from 'js/components/cells/CellsResults';
import DatasetsSelectedByExpression from 'js/components/cells/DatasetsSelectedByExpression';
import AccordionSteps from 'js/shared-styles/accordions/AccordionSteps';
import { AccordionStepsProvider } from 'js/shared-styles/accordions/AccordionSteps/store';
import React from 'react';

export default function BiomarkerQuery() {
  const runQueryButtonRef = React.useRef<HTMLButtonElement>(null);
  const steps = [
    {
      heading: '1. Parameters',
      content: <DatasetsSelectedByExpression runQueryButtonRef={runQueryButtonRef} />,
    },
    {
      heading: '2. Results',
      content: <CellsResults />,
    },
  ];
  return (
    <AccordionStepsProvider stepsLength={steps.length}>
      <AccordionSteps id="cells-steps" steps={steps} isFirstStepOpen />
    </AccordionStepsProvider>
  );
}
