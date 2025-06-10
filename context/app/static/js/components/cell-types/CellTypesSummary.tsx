import React, { useEffect } from 'react';

import DetailPageSection from 'js/components/detailPage/DetailPageSection';

import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import SummaryPaper from 'js/shared-styles/sections/SectionPaper';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';

import useEntityStore from 'js/stores/useEntityStore';

import Skeleton from '@mui/material/Skeleton';
import RelevantPagesSection from 'js/shared-styles/sections/RelevantPagesSection';
import { useCellTypeInfo, useCellTypeName } from './hooks';
import { useCellTypesContext } from './CellTypesContext';

function ReferenceLink({ cellId }: { cellId: string }) {
  return (
    <OutboundIconLink href={`http://purl.obolibrary.org/obo/${cellId.replace(':', '_')}`}>{cellId}</OutboundIconLink>
  );
}

function DescriptionFallback() {
  return (
    <>
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="92%" />
      <Skeleton variant="text" width="96%" />
      <Skeleton variant="text" width="33%" />
    </>
  );
}

const relevantPages = [
  // TODO: Uncomment when the cell types landing page is ready
  // {
  //   children: 'Cell Types',
  //   link: '/cell-types',
  // },
  {
    children: 'Molecular & Cellular Data Query',
    link: '/cells',
  },
];

export default function CellTypesSummary() {
  const { data } = useCellTypeInfo();
  const setAssayMetadata = useEntityStore((s) => s.setAssayMetadata);

  const { cellId } = useCellTypesContext();
  const cellName = useCellTypeName();

  useEffect(() => {
    if (cellName) {
      document.title = `${cellName} - Cell Type`;
      setAssayMetadata({
        name: cellName,
        entity_type: 'CellType',
        reference_link: <ReferenceLink cellId={cellId} />,
      });
    }
  }, [cellName, setAssayMetadata, cellId]);

  return (
    <DetailPageSection id="summary">
      <SummaryPaper>
        <LabelledSectionText
          label="Description"
          bottomSpacing={1}
          iconTooltipText="Description provided by Cell Ontology."
        >
          {data?.cell_type.definition ?? <DescriptionFallback />}
        </LabelledSectionText>
        <LabelledSectionText
          label="Known References"
          bottomSpacing={1}
          childContainerComponent="div"
          iconTooltipText="References from established databases."
        >
          <ReferenceLink cellId={cellId} />
        </LabelledSectionText>
        <RelevantPagesSection pages={relevantPages} />
      </SummaryPaper>
    </DetailPageSection>
  );
}
