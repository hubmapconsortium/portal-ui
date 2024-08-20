import React, { useMemo } from 'react';

import { useFlaskDataContext } from 'js/components/Contexts';
import ProvSection from 'js/components/detailPage/provenance/ProvSection';
import Summary from 'js/components/detailPage/summary/Summary';
import Attribution from 'js/components/detailPage/Attribution';
import Protocol from 'js/components/detailPage/Protocol';
import DetailLayout from 'js/components/detailPage/DetailLayout';
import { DetailContext } from 'js/components/detailPage/DetailContext';
import DerivedEntitiesSection from 'js/components/detailPage/derivedEntities/DerivedEntitiesSection';
import useTrackID from 'js/hooks/useTrackID';
import MetadataSection from 'js/components/detailPage/MetadataSection';

function DonorDetail() {
  const {
    entity: {
      uuid,
      protocol_url,
      hubmap_id,
      entity_type,
      mapped_metadata = {},
      created_timestamp,
      last_modified_timestamp,
      description,
      group_name,
      created_by_user_displayname,
      created_by_user_email,
    },
  } = useFlaskDataContext();

  const shouldDisplaySection = {
    summary: true,
    metadata: Boolean(Object.keys(mapped_metadata).length),
    'derived-data': true,
    provenance: true,
    protocols: Boolean(protocol_url),
    attribution: true,
  };

  useTrackID({ entity_type, hubmap_id });

  const detailContext = useMemo(() => ({ hubmap_id, uuid }), [hubmap_id, uuid]);

  return (
    <DetailContext.Provider value={detailContext}>
      <DetailLayout sections={shouldDisplaySection}>
        <Summary
          uuid={uuid}
          entity_type={entity_type}
          title={hubmap_id}
          created_timestamp={created_timestamp}
          last_modified_timestamp={last_modified_timestamp}
          description={description}
          group_name={group_name}
        />
        {shouldDisplaySection.metadata && <MetadataSection metadata={mapped_metadata} hubmap_id={hubmap_id} />}
        <DerivedEntitiesSection />
        <ProvSection />
        {shouldDisplaySection.protocols && <Protocol protocol_url={protocol_url} showHeader />}
        <Attribution
          group_name={group_name}
          created_by_user_displayname={created_by_user_displayname}
          created_by_user_email={created_by_user_email}
        />
      </DetailLayout>
    </DetailContext.Provider>
  );
}

export default DonorDetail;
