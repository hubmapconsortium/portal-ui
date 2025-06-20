import React, { useEffect, useMemo } from 'react';

import DetailPageSection from 'js/components/detailPage/DetailPageSection';

import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import SummaryPaper from 'js/shared-styles/sections/SectionPaper';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';

import useEntityStore from 'js/stores/useEntityStore';

import Skeleton from '@mui/material/Skeleton';
import RelevantPagesSection from 'js/shared-styles/sections/RelevantPagesSection';
import { useCellTypeInfo } from './hooks';
import { useCellTypesDetailPageContext } from './CellTypesDetailPageContext';

function ReferenceLink({ cellId }: { cellId: string }) {
  const { track } = useCellTypesDetailPageContext();
  return (
    <OutboundIconLink
      onClick={() => {
        track('Summary / Select "Known References"', 'OBO Reference Link');
      }}
      href={`http://purl.obolibrary.org/obo/${cellId.replace(':', '_')}`}
    >
      {cellId}
    </OutboundIconLink>
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

  const { cellId, track, name } = useCellTypesDetailPageContext();

  useEffect(() => {
    if (name) {
      document.title = `${name} - Cell Type`;
      setAssayMetadata({
        name,
        entity_type: 'CellType',
        reference_link: <ReferenceLink cellId={cellId} />,
      });
    }
  }, [name, setAssayMetadata, cellId]);

  const relevantPagesWithTracking = useMemo(() => {
    return relevantPages.map((page) => ({
      ...page,
      onClick: () => {
        track('Summary / Select Relevant Page Button', page.children);
      },
    }));
  }, [track]);

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
        <RelevantPagesSection pages={relevantPagesWithTracking} />
      </SummaryPaper>
    </DetailPageSection>
  );
}
