import React, { useEffect, useMemo } from 'react';
import Typography from '@mui/material/Typography';

import { InternalLink } from 'js/shared-styles/Links';
import { useFlaskDataContext } from 'js/components/Contexts';
import ProvSection from 'js/components/detailPage/provenance/ProvSection';
import Summary from 'js/components/detailPage/summary/Summary';
import Attribution from 'js/components/detailPage/Attribution';
import Protocol from 'js/components/detailPage/Protocol';
import SummaryItem from 'js/components/detailPage/summary/SummaryItem';
import DetailLayout from 'js/components/detailPage/DetailLayout';
import SampleTissue from 'js/components/detailPage/SampleTissue';
import useEntityStore from 'js/stores/useEntityStore';
import { DetailContext } from 'js/components/detailPage/DetailContext';
import { getSectionOrder } from 'js/components/detailPage/utils';

import DerivedDatasetsSection from 'js/components/detailPage/derivedEntities/DerivedDatasetsSection';

import { combineMetadata } from 'js/pages/utils/entity-utils';
import useTrackID from 'js/hooks/useTrackID';
import MetadataSection from 'js/components/detailPage/MetadataSection';

const entityStoreSelector = (state) => state.setAssayMetadata;

function SampleDetail() {
  const {
    entity: {
      uuid,
      donor,
      protocol_url,
      sample_category,
      origin_samples,
      hubmap_id,
      entity_type,
      metadata,
      descendant_counts,
    },
  } = useFlaskDataContext();

  // TODO: Update design to reflect samples and datasets which have multiple origin samples with different organs.
  const origin_sample = origin_samples[0];
  const { mapped_organ } = origin_sample;

  const combinedMetadata = combineMetadata(donor, undefined, undefined, metadata);

  const shouldDisplaySection = {
    protocols: Boolean(protocol_url),
    tissue: true,
    metadata: Boolean(Object.keys(combinedMetadata).length),
    derived: Boolean(descendant_counts?.entity_type?.Dataset > 0),
  };

  const sectionOrder = getSectionOrder(
    ['summary', 'derived', 'tissue', 'provenance', 'protocols', 'metadata', 'attribution'],
    shouldDisplaySection,
  );

  const setAssayMetadata = useEntityStore(entityStoreSelector);
  useEffect(() => {
    setAssayMetadata({ hubmap_id, entity_type, mapped_organ, sample_category });
  }, [hubmap_id, entity_type, mapped_organ, sample_category, setAssayMetadata]);

  useTrackID({ entity_type, hubmap_id });

  const detailContext = useMemo(() => ({ hubmap_id, uuid }), [hubmap_id, uuid]);

  return (
    <DetailContext.Provider value={detailContext}>
      <DetailLayout sectionOrder={sectionOrder}>
        <Summary>
          <SummaryItem>
            <InternalLink variant="h6" href={`/organ/${mapped_organ}`} underline="none">
              {mapped_organ}
            </InternalLink>
          </SummaryItem>
          <Typography variant="h6" component="p">
            {sample_category}
          </Typography>
        </Summary>
        {shouldDisplaySection.derived && <DerivedDatasetsSection uuid={uuid} entityType={entity_type} />}
        <SampleTissue />
        <ProvSection />
        {shouldDisplaySection.protocols && <Protocol protocol_url={protocol_url} />}
        {shouldDisplaySection.metadata && <MetadataSection metadata={combinedMetadata} hubmap_id={hubmap_id} />}
        <Attribution />
      </DetailLayout>
    </DetailContext.Provider>
  );
}

export default SampleDetail;
