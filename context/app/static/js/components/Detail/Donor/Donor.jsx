/* eslint-disable camelcase */
import React from 'react';
import ProvTabs from '../ProvTabs';
import Summary from '../Summary';
import Attribution from '../Attribution';
import Protocol from '../Protocol';
import Metadata from '../Metadata';
import DetailLayout from '../DetailLayout';

function DonorDetail(props) {
  const { assayMetadata, flashed_messages, entityEndpoint } = props;
  const {
    uuid,
    protocol_url,
    portal_uploaded_protocol_files,
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
    protocols: Boolean(portal_uploaded_protocol_files || protocol_url),
    metadata: Boolean(mapped_metadata),
  };

  return (
    <DetailLayout shouldDisplaySection={shouldDisplaySection} flashed_messages={flashed_messages}>
      <Summary
        uuid={uuid}
        entity_type={entity_type}
        display_doi={display_doi}
        create_timestamp={create_timestamp}
        last_modified_timestamp={last_modified_timestamp}
        description={description}
      />
      {shouldDisplaySection.metadata && <Metadata entity_type={entity_type} metadata={mapped_metadata} />}
      <Attribution
        group_name={group_name}
        created_by_user_displayname={created_by_user_displayname}
        created_by_user_email={created_by_user_email}
      />
      <ProvTabs uuid={uuid} assayMetadata={assayMetadata} entityEndpoint={entityEndpoint} />
      {shouldDisplaySection.protocols && (
        <Protocol protocol_url={protocol_url} portal_uploaded_protocol_files={portal_uploaded_protocol_files} />
      )}
    </DetailLayout>
  );
}

export default DonorDetail;
