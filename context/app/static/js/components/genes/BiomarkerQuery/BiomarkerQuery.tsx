import MolecularDataQueryResults from 'js/components/cells/MolecularDataQueryResults';
import QueryParameters from 'js/components/cells/MolecularDataQueryForm/QueryParameters';
import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import AccordionSteps from 'js/shared-styles/accordions/AccordionSteps';
import { AccordionStepsProvider } from 'js/shared-styles/accordions/AccordionSteps/store';
import React, { useMemo } from 'react';
import { biomarkerQuery } from '../constants';

export default function BiomarkerQuery() {
  const steps = useMemo(() => {
    return [
      {
        heading: '1. Parameters',
        content: <QueryParameters />,
      },
      {
        heading: '2. Results',
        content: <MolecularDataQueryResults />,
      },
    ];
  }, []);

  return (
    <CollapsibleDetailPageSection
      id={biomarkerQuery.id}
      title={biomarkerQuery.title}
      iconTooltipText={biomarkerQuery.tooltip}
    >
      <AccordionStepsProvider stepsLength={steps.length}>
        <AccordionSteps id="biomarker-query-steps" steps={steps} />
      </AccordionStepsProvider>
    </CollapsibleDetailPageSection>
  );
}
