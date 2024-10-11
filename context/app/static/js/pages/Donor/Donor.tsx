import React, { useMemo } from 'react';

import { useFlaskDataContext } from 'js/components/Contexts';
import Summary from 'js/components/detailPage/summary/Summary';
import Attribution from 'js/components/detailPage/Attribution';
import Protocol from 'js/components/detailPage/Protocol';
import DetailLayout from 'js/components/detailPage/DetailLayout';
import { DetailContext } from 'js/components/detailPage/DetailContext';
import DerivedEntitiesSection from 'js/components/detailPage/derivedEntities/DerivedEntitiesSection';
import useTrackID from 'js/hooks/useTrackID';
import MetadataSection from 'js/components/detailPage/MetadataSection';
import { isDonor } from 'js/components/types';

function DonorDetail() {
  const { entity } = useFlaskDataContext();

  if (!isDonor(entity)) {
    throw new Error('Entity is not a donor');
  }

  const { uuid, protocol_url, hubmap_id, entity_type, mapped_metadata = {}, mapped_data_access_level } = entity;

  const shouldDisplaySection = {
    summary: true,
    metadata: Boolean(Object.keys(mapped_metadata).length),
    'derived-data': true,
    protocols: Boolean(protocol_url),
    attribution: true,
  };

  useTrackID({ entity_type, hubmap_id });

  const detailContext = useMemo(
    () => ({ hubmap_id, uuid, mapped_data_access_level }),
    [hubmap_id, uuid, mapped_data_access_level],
  );

  return (
    <DetailContext.Provider value={detailContext}>
      <DetailLayout sections={shouldDisplaySection}>
        <Summary title={hubmap_id} />
        <MetadataSection
          metadata={mapped_metadata as Record<string, string>}
          shouldDisplay={shouldDisplaySection.metadata}
        />
        <DerivedEntitiesSection />
        <Protocol protocol_url={protocol_url} showHeader shouldDisplay={shouldDisplaySection.protocols} />
        <Attribution />
      </DetailLayout>
    </DetailContext.Provider>
  );
}

export default DonorDetail;
