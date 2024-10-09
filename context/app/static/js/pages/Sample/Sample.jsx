import React, { useMemo } from 'react';
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
import { DetailContext } from 'js/components/detailPage/DetailContext';
import { hasMetadata } from 'js/helpers/metadata';

import DerivedDatasetsSection from 'js/components/detailPage/derivedEntities/DerivedDatasetsSection';

import useTrackID from 'js/hooks/useTrackID';
import MetadataSection from 'js/components/detailPage/MetadataSection';
import { useEntitiesData } from 'js/hooks/useEntityData';

function SampleDetail() {
  const { entity } = useFlaskDataContext();
  const {
    uuid,
    protocol_url,
    sample_category,
    origin_samples,
    hubmap_id,
    entity_type,
    descendant_counts,
    ancestor_ids,
  } = entity;

  const [entities, loadingEntities] = useEntitiesData([uuid, ...ancestor_ids]);
  const entitiesWithMetadata = entities.filter((e) =>
    hasMetadata({ targetEntityType: e.entity_type, currentEntity: e }),
  );

  // TODO: Update design to reflect samples and datasets which have multiple origin samples with different organs.
  const origin_sample = origin_samples[0];
  const { mapped_organ } = origin_sample;

  const shouldDisplaySection = {
    summary: true,
    'derived-data': Boolean(descendant_counts?.entity_type?.Dataset > 0),
    tissue: true,
    provenance: true,
    protocols: Boolean(protocol_url),
    metadata: Boolean(entitiesWithMetadata.length),
    attribution: true,
  };

  useTrackID({ entity_type, hubmap_id });

  const detailContext = useMemo(() => ({ hubmap_id, uuid }), [hubmap_id, uuid]);

  if (loadingEntities) {
    return null;
  }

  return (
    <DetailContext.Provider value={detailContext}>
      <DetailLayout sections={shouldDisplaySection}>
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
        {shouldDisplaySection['derived-data'] && <DerivedDatasetsSection uuid={uuid} entityType={entity_type} />}
        <SampleTissue />
        <ProvSection />
        {shouldDisplaySection.protocols && <Protocol protocol_url={protocol_url} showHeader />}
        <MetadataSection entities={entitiesWithMetadata} shouldDisplay={shouldDisplaySection.metadata} />
        <Attribution />
      </DetailLayout>
    </DetailContext.Provider>
  );
}

export default SampleDetail;
