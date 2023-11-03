import CellsResults from 'js/components/cells/CellsResults';
import DatasetsSelectedByExpression from 'js/components/cells/DatasetsSelectedByExpression';
import { DetailPageSection } from 'js/components/detailPage/style';
import AccordionSteps from 'js/shared-styles/accordions/AccordionSteps';
import { AccordionStepsProvider } from 'js/shared-styles/accordions/AccordionSteps/store';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import React, { useMemo } from 'react';
import TutorialProvider from 'js/shared-styles/tutorials/TutorialProvider';
import { useGeneDetails, useGenePageContext } from '../hooks';

export default function BiomarkerQuery() {
  const { geneSymbol } = useGenePageContext();
  const { data } = useGeneDetails();
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
          <TutorialProvider>
            <CellsResults />
          </TutorialProvider>
        ),
      },
    ];
  }, [geneSymbol, data?.approved_symbol]);

  return (
    <DetailPageSection id="biomarker-query">
      <SectionHeader iconTooltipText="Query HuBMAP datasets for biomarker(s) data">
        Datasets: Biomarker Query
      </SectionHeader>
      <AccordionStepsProvider stepsLength={steps.length}>
        <AccordionSteps id="biomarker-query-steps" steps={steps} />
      </AccordionStepsProvider>
    </DetailPageSection>
  );
}
