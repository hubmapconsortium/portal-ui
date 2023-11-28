import React from 'react';
import { DetailPageSection } from 'js/components/detailPage/style';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import SummaryPaper from 'js/shared-styles/sections/SectionPaper';

export default function CellTypesSummary() {
  return (
    <DetailPageSection id="summary">
      <SummaryPaper>
        <LabelledSectionText label="Description" bottomSpacing={1}>
          TODO
        </LabelledSectionText>
        <LabelledSectionText
          label="Known References"
          childContainerComponent="div"
          iconTooltipText="References from established databases."
        >
          TODO
        </LabelledSectionText>
      </SummaryPaper>
    </DetailPageSection>
  );
}
