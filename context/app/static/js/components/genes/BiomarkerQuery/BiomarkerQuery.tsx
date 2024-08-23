import CellsResults from 'js/components/cells/CellsResults';
import DatasetsSelectedByExpression from 'js/components/cells/DatasetsSelectedByExpression';
import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import AccordionSteps from 'js/shared-styles/accordions/AccordionSteps';
import { AccordionStepsProvider } from 'js/shared-styles/accordions/AccordionSteps/store';
import React, { useMemo } from 'react';
import TutorialProvider from 'js/shared-styles/tutorials/TutorialProvider';
import { useGeneOntology, useGenePageContext } from '../hooks';
import { biomarkerQuery } from '../constants';

export default function BiomarkerQuery() {
  const { geneSymbol } = useGenePageContext();
  const { data } = useGeneOntology();
  const runQueryButtonRef = React.useRef<HTMLButtonElement>(null);
  const steps = useMemo(() => {
    return [
      {
        heading: '1. Parameters',
        content: (
          <DatasetsSelectedByExpression
            runQueryButtonRef={runQueryButtonRef}
            defaultEntity={data?.approved_symbol ?? geneSymbol.toUpperCase()}
          />
        ),
      },
      {
        heading: '2. Results',
        content: (
          <TutorialProvider tutorial_key="cells">
            <CellsResults />
          </TutorialProvider>
        ),
      },
    ];
  }, [geneSymbol, data?.approved_symbol]);

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
