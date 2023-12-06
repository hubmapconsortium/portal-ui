import React, { useEffect } from 'react';
import { DetailPageSection } from 'js/components/detailPage/style';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import SummaryPaper from 'js/shared-styles/sections/SectionPaper';
import { useEntityStore } from 'js/stores';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import { useCellTypeInfo } from './hooks';
import { useCellTypesContext } from './CellTypesContext';

function ReferenceLink({ cellId }: { cellId: string }) {
  return (
    <OutboundIconLink href={`http://purl.obolibrary.org/obo/${cellId.replace(':', '_')}`}>{cellId}</OutboundIconLink>
  );
}

export default function CellTypesSummary() {
  const { data } = useCellTypeInfo();
  const setAssayMetadata = useEntityStore((s) => s.setAssayMetadata);

  const { cellId } = useCellTypesContext();

  useEffect(() => {
    if (data) {
      document.title = `${data.cell_type.name} - Cell Type`;
      setAssayMetadata({
        name: data.cell_type.name,
        entity_type: 'CellType',
        reference_link: <ReferenceLink cellId={cellId} />,
      });
    }
  }, [data, setAssayMetadata, cellId]);

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
          <ReferenceLink cellId={cellId} />
        </LabelledSectionText>
      </SummaryPaper>
    </DetailPageSection>
  );
}
