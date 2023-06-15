import React from 'react';
import SummaryPaper from 'js/shared-styles/sections/SectionPaper';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';

function SummaryBody({ geneSummary, geneId }) {
  return (
    <SummaryPaper>
      <LabelledSectionText label="Description" bottomSpacing={2}>
        {geneSummary}
      </LabelledSectionText>
      <LabelledSectionText label="Known References" bottomSpacing={2}>
        <OutboundIconLink href={`https://www.ncbi.nlm.nih.gov/gene/${geneId}`}>NCBI Gene</OutboundIconLink>
        <OutboundIconLink href={`https://www.ncbi.nlm.nih.gov/gene/${geneId}`}>HUGO HGNC:</OutboundIconLink>
      </LabelledSectionText>
    </SummaryPaper>
  );
}

export default SummaryBody;
