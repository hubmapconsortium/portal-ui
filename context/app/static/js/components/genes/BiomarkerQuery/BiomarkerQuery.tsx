import CellsResults from 'js/components/cells/CellsResults';
import DatasetsSelectedByExpression from 'js/components/cells/DatasetsSelectedByExpression';
import { DetailPageSection } from 'js/components/detailPage/style';
import AccordionSteps from 'js/shared-styles/accordions/AccordionSteps';
import { AccordionStepsProvider } from 'js/shared-styles/accordions/AccordionSteps/store';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
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
    <DetailPageSection id={biomarkerQuery.id}>
      <SectionHeader iconTooltipText={biomarkerQuery.tooltip}>{biomarkerQuery.title}</SectionHeader>
      <AccordionStepsProvider stepsLength={steps.length}>
        <AccordionSteps id="biomarker-query-steps" steps={steps} />
      </AccordionStepsProvider>
    </DetailPageSection>
  );
}
