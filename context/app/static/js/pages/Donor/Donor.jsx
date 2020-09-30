import React from 'react';
import MetadataTable from 'js/components/Detail/MetadataTable';
import ProvSection from 'js/components/Detail/provenance/ProvSection';
import Summary from 'js/components/Detail/Summary';
import Attribution from 'js/components/Detail/Attribution';
import Protocol from 'js/components/Detail/Protocol';
import DetailLayout from 'js/components/Detail/DetailLayout';
import useSendUUIDEvent from 'js/components/Detail/useSendUUIDEvent';

import DetailContext from 'js/components/Detail/context';
import { getSectionOrder } from 'js/components/Detail/utils';

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
    mapped_metadata,
  } = assayMetadata;

  const shouldDisplaySection = {
    protocols: Boolean(protocol_url),
    metadata: Boolean(mapped_metadata),
  };

  const sectionOrder = getSectionOrder(
    ['summary', 'metadata', 'attribution', 'provenance', 'protocols'],
    shouldDisplaySection,
  );

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
        />
        {shouldDisplaySection.metadata && <MetadataTable metadata={mapped_metadata} display_doi={display_doi} />}
        <Attribution
          group_name={group_name}
          created_by_user_displayname={created_by_user_displayname}
          created_by_user_email={created_by_user_email}
        />
        <ProvSection uuid={uuid} assayMetadata={assayMetadata} />
        {shouldDisplaySection.protocols && <Protocol protocol_url={protocol_url} />}
      </DetailLayout>
    </DetailContext.Provider>
  );
}

export default DonorDetail;
