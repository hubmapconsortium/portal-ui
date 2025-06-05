import React, { useEffect, useMemo } from 'react';
import DetailPageSection from 'js/components/detailPage/DetailPageSection';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import SummaryPaper from 'js/shared-styles/sections/SectionPaper';

import Skeleton from '@mui/material/Skeleton';
import useEntityStore from 'js/stores/useEntityStore';
import RelevantPagesSection from 'js/shared-styles/sections/RelevantPagesSection';
import { trackEvent } from 'js/helpers/trackers';
import { useGeneOntology, useGenePageContext } from '../hooks';
import KnownReferences from './KnownReferences';

function SummarySkeleton() {
  return (
    <>
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </>
  );
}

const trackRelevantPageClick = (label: string) => {
  trackEvent({
    category: 'Gene Detail Page',
    action: 'Select Relevant Page Button',
    label,
  });
};

const relevantPages = [
  {
    link: '/genes',
    children: 'Biomarkers',
  },
  {
    link: '/cells',
    children: 'Molecular and Cellular Data Query',
  },
];

function Summary() {
  const { data } = useGeneOntology();
  const { geneSymbolUpper } = useGenePageContext();

  const setAssayMetadata = useEntityStore((s) => s.setAssayMetadata);

  useEffect(() => {
    if (data) {
      const title = `${data.approved_name} (${data.approved_symbol})`;
      document.title = `${title} | HuBMAP`;
      setAssayMetadata({
        name: title,
        entity_type: 'Gene',
      });
    }
  }, [data, setAssayMetadata]);

  const relevantPagesWithTracking = useMemo(() => {
    return relevantPages.map((page) => ({
      ...page,
      onClick: () => {
        trackRelevantPageClick(`${data?.approved_symbol ?? geneSymbolUpper} ${page.children}`);
      },
    }));
  }, [data?.approved_symbol, geneSymbolUpper]);

  return (
    <DetailPageSection id="summary">
      <SummaryPaper>
        <LabelledSectionText label="Description" bottomSpacing={1} iconTooltipText="Gene description from NCBI Gene.">
          {data?.summary ?? <SummarySkeleton />}
        </LabelledSectionText>
        <LabelledSectionText
          label="Known References"
          bottomSpacing={1}
          childContainerComponent="div"
          iconTooltipText="References from established databases."
        >
          <KnownReferences />
        </LabelledSectionText>
        <RelevantPagesSection pages={relevantPagesWithTracking} />
      </SummaryPaper>
    </DetailPageSection>
  );
}

export default Summary;
