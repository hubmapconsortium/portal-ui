import React, { useEffect, useMemo } from 'react';

import DetailPageSection from 'js/components/detailPage/DetailPageSection';

import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import SummaryPaper from 'js/shared-styles/sections/SectionPaper';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';

import useEntityStore from 'js/stores/useEntityStore';

import Skeleton from '@mui/material/Skeleton';
import RelevantPagesSection from 'js/shared-styles/sections/RelevantPagesSection';
import { trackEvent } from 'js/helpers/trackers';
import { useEventCallback } from '@mui/material/utils';
import { useCellTypeInfo } from './hooks';
import { useCellTypesDetailPageContext } from './CellTypesDetailPageContext';

function ReferenceLink({ cellId, onClick }: { cellId: string; onClick?: () => void }) {
  return (
    <OutboundIconLink onClick={onClick} href={`http://purl.obolibrary.org/obo/${cellId.replace(':', '_')}`}>
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
  {
    children: 'Cell Types',
    link: '/cell-types',
  },
  {
    children: 'Biomarker and Cell Type Search',
    link: '/search/biomarkers-cell-types',
  },
];

export default function CellTypesSummary() {
  const { data } = useCellTypeInfo();
  const setAssayMetadata = useEntityStore((s) => s.setAssayMetadata);

  const { cellId, trackingInfo, name } = useCellTypesDetailPageContext();

  const trackReferenceLink = useEventCallback(() => {
    trackEvent({
      action: 'Summary / Select "Known Reference',
      label: `${trackingInfo.label} OBO Reference Link`,
    });
  });

  useEffect(() => {
    if (name) {
      document.title = `${name} - Cell Type`;
      setAssayMetadata({
        name,
        entity_type: 'CellType',
        reference_link: <ReferenceLink cellId={cellId} onClick={trackReferenceLink} />,
      });
    }
  }, [name, setAssayMetadata, cellId, trackReferenceLink]);

  const relevantPagesWithTracking = useMemo(() => {
    return relevantPages.map((page) => ({
      ...page,
      onClick: () => {
        trackEvent({
          action: 'Summary / Select Relevant Page Button',
          label: `${trackingInfo.label} ${page.children}`,
        });
      },
    }));
  }, [trackingInfo]);

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
          <ReferenceLink cellId={cellId} onClick={trackReferenceLink} />
        </LabelledSectionText>
        <RelevantPagesSection pages={relevantPagesWithTracking} />
      </SummaryPaper>
    </DetailPageSection>
  );
}
