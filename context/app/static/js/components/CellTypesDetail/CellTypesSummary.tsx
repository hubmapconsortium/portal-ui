import React from 'react';
import { DetailPageSection } from 'js/components/detailPage/style';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import SummaryPaper from 'js/shared-styles/sections/SectionPaper';
import { OutboundLink } from 'js/shared-styles/Links';
import { useCellTypeInfo } from './hooks';
import { useCellTypesContext } from './CellTypesContext';

export default function CellTypesSummary() {
  const { cellId } = useCellTypesContext();
  const { data } = useCellTypeInfo();

  return (
    <DetailPageSection id="summary">
      <SummaryPaper>
        <LabelledSectionText label="Description" bottomSpacing={1}>
          {data?.cell_type.definition}
        </LabelledSectionText>
        <LabelledSectionText
          label="Known References"
          childContainerComponent="div"
          iconTooltipText="References from established databases."
        >
          <OutboundLink href={`http://purl.obolibrary.org/obo/${cellId.replace(':', '_')}`}>{cellId}</OutboundLink>
        </LabelledSectionText>
      </SummaryPaper>
    </DetailPageSection>
  );
}
