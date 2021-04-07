import React, { useEffect } from 'react';
import MetadataTable from 'js/components/Detail/MetadataTable';
import ProvSection from 'js/components/Detail/provenance/ProvSection';
import Summary from 'js/components/Detail/Summary';
import Attribution from 'js/components/Detail/Attribution';
import Protocol from 'js/components/Detail/Protocol';
import DetailLayout from 'js/components/Detail/DetailLayout';
import useSendUUIDEvent from 'js/components/Detail/useSendUUIDEvent';
import useEntityStore from 'js/stores/useEntityStore';

import DetailContext from 'js/components/Detail/context';
import { getSectionOrder } from 'js/components/Detail/utils';

const entityStoreSelector = (state) => state.setAssayMetadata;

function DonorDetail(props) {
  const { assayMetadata } = props;
  const {
    uuid,
    protocol_url,
    group_name,
    created_by_user_displayname,
    created_by_user_email,
    display_doi,
    entity_type,
    create_timestamp,
    last_modified_timestamp,
    description,
    mapped_metadata = {},
    // As data comes in from other consortia, we won't be able
    // to rely on donor metadata always being available.
  } = assayMetadata;

  const { sex, race, age_value, age_unit } = mapped_metadata;

  const shouldDisplaySection = {
    protocols: Boolean(protocol_url),
    metadata: Boolean(Object.keys(mapped_metadata).length),
  };

  const sectionOrder = getSectionOrder(
    ['summary', 'metadata', 'provenance', 'protocols', 'attribution'],
    shouldDisplaySection,
  );

  const setAssayMetadata = useEntityStore(entityStoreSelector);

  useEffect(() => {
    setAssayMetadata({ display_doi, entity_type, sex, race, age_value, age_unit });
  }, [setAssayMetadata, display_doi, entity_type, sex, race, age_value, age_unit]);

  useSendUUIDEvent(entity_type, uuid);

  return (
    <DetailContext.Provider value={{ display_doi, uuid }}>
      <DetailLayout sectionOrder={sectionOrder}>
        <Summary
          uuid={uuid}
          entity_type={entity_type}
          display_doi={display_doi}
          create_timestamp={create_timestamp}
          last_modified_timestamp={last_modified_timestamp}
          description={description}
          group_name={group_name}
        />
        {shouldDisplaySection.metadata && <MetadataTable metadata={mapped_metadata} display_doi={display_doi} />}
        <ProvSection uuid={uuid} assayMetadata={assayMetadata} />
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
