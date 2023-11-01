import React from 'react';
import { DetailPageSection } from 'js/components/detailPage/style';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import SummaryPaper from 'js/shared-styles/sections/SectionPaper'
import { useGeneDetails } from 'js/pages/Genes/hooks';
import { useGenePageContext } from '../GenePageContext';
import KnownReferences from './KnownReferences';

function Summary() {
  const { geneSymbol } = useGenePageContext();
  const { data } = useGeneDetails(geneSymbol);
  return (
    <DetailPageSection id="summary">
      <SummaryPaper>
        
      <LabelledSectionText label="Description" bottomSpacing={1}>
        {data?.summary}
      </LabelledSectionText>
      <LabelledSectionText label="Known References" bottomSpacing={1}>
        <KnownReferences />
      </LabelledSectionText>
      </SummaryPaper>
    </DetailPageSection>
  );
}

export default Summary;
