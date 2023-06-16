import React from 'react';
import SummaryPaper from 'js/shared-styles/sections/SectionPaper';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';

function SummaryBody({ geneSummary }) {
  return (
    <SummaryPaper>
      <LabelledSectionText label="Description" bottomSpacing={1}>
        {geneSummary}
      </LabelledSectionText>
    </SummaryPaper>
  );
}

export default SummaryBody;
