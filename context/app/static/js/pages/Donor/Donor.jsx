import React from 'react';

import ProvSection from 'js/components/detail/ProvSection';
import Summary from 'js/components/detail/Summary';
import Attribution from 'js/components/detail/Attribution';
import Protocol from 'js/components/detail/Protocol';
import DonorMetadata from 'js/components/detail/DonorMetadata';
import DetailLayout from 'js/components/detail/DetailLayout';
import DetailContext from 'js/components/detail/context';

function DonorDetail(props) {
  const { assayMetadata, entityEndpoint, elasticsearchEndpoint } = props;
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

  return (
    <DetailContext.Provider value={{ elasticsearchEndpoint, display_doi, uuid }}>
      <DetailLayout shouldDisplaySection={shouldDisplaySection}>
        <Summary
          uuid={uuid}
          entity_type={entity_type}
          display_doi={display_doi}
          create_timestamp={create_timestamp}
          last_modified_timestamp={last_modified_timestamp}
          description={description}
        />
        {shouldDisplaySection.metadata && <DonorMetadata metadata={mapped_metadata} />}
        <Attribution
          group_name={group_name}
          created_by_user_displayname={created_by_user_displayname}
          created_by_user_email={created_by_user_email}
        />
        <ProvSection uuid={uuid} assayMetadata={assayMetadata} entityEndpoint={entityEndpoint} />
        {shouldDisplaySection.protocols && <Protocol protocol_url={protocol_url} />}
      </DetailLayout>
    </DetailContext.Provider>
  );
}

export default DonorDetail;
