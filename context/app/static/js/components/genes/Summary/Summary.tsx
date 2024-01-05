import React, { useEffect } from 'react';
import { DetailPageSection } from 'js/components/detailPage/style';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import SummaryPaper from 'js/shared-styles/sections/SectionPaper';

import Skeleton from '@mui/material/Skeleton';
import useEntityStore from 'js/stores/useEntityStore';
import { useGeneDetails } from '../hooks';
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

function Summary() {
  const { data } = useGeneDetails();

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
      </SummaryPaper>
    </DetailPageSection>
  );
}

export default Summary;
