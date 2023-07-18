import React, { useEffect, useMemo } from 'react';
import { useFlaskDataContext } from 'js/components/Contexts';
import MetadataTable from 'js/components/detailPage/MetadataTable';
import ProvSection from 'js/components/detailPage/provenance/ProvSection';
import Summary from 'js/components/detailPage/summary/Summary';
import Attribution from 'js/components/detailPage/Attribution';
import Protocol from 'js/components/detailPage/Protocol';
import DetailLayout from 'js/components/detailPage/DetailLayout';
import useSendUUIDEvent from 'js/components/detailPage/useSendUUIDEvent';
import useEntityStore from 'js/stores/useEntityStore';
import DetailContext from 'js/components/detailPage/context';
import { getSectionOrder } from 'js/components/detailPage/utils';
import DerivedEntitiesSection from 'js/components/detailPage/derivedEntities/DerivedEntitiesSection';

const entityStoreSelector = (state) => state.setAssayMetadata;

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
  const { sex, race, age_value, age_unit } = mapped_metadata;

  const shouldDisplaySection = {
    protocols: Boolean(protocol_url),
    metadata: Boolean(Object.keys(mapped_metadata).length),
  };

  const sectionOrder = getSectionOrder(
    ['summary', 'metadata', 'derived', 'provenance', 'protocols', 'attribution'],
    shouldDisplaySection,
  );

  const setAssayMetadata = useEntityStore(entityStoreSelector);
  useEffect(() => {
    setAssayMetadata({
      hubmap_id,
      entity_type,
      sex,
      race,
      age_value,
      age_unit,
    });
  }, [hubmap_id, entity_type, sex, race, age_value, age_unit, setAssayMetadata, group_name]);

  useSendUUIDEvent(entity_type, uuid);

  const detailContext = useMemo(() => ({ hubmap_id, uuid }), [hubmap_id, uuid]);

  return (
    <DetailContext.Provider value={detailContext}>
      <DetailLayout sectionOrder={sectionOrder}>
        <Summary
          uuid={uuid}
          entity_type={entity_type}
          title={hubmap_id}
          created_timestamp={created_timestamp}
          last_modified_timestamp={last_modified_timestamp}
          description={description}
          group_name={group_name}
        />
        {shouldDisplaySection.metadata && <MetadataTable metadata={mapped_metadata} hubmap_id={hubmap_id} />}
        <DerivedEntitiesSection sectionId="derived" />
        <ProvSection />
        {shouldDisplaySection.protocols && <Protocol protocol_url={protocol_url} />}
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
