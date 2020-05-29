/* eslint-disable camelcase */
import React from 'react';
import ProvTabs from './Detail/ProvTabs';
import Summary from './Detail/Summary';
import Attribution from './Detail/Attribution';
import Protocol from './Detail/Protocol';
import Metadata from './Detail/Metadata';
import DetailLayout from './Detail/DetailLayout';

function getDonorMetadata(metadata) {
  const donorMetadata = metadata.reduce((acc, d) => {
    if (['Gender finding', 'Racial group'].includes(d.grouping_concept_preferred_term)) {
      acc[d.grouping_concept_preferred_term] = d.preferred_term;
    } else {
      acc[d.grouping_concept_preferred_term] = d.data_value;
    }
    return acc;
  }, {});
  return donorMetadata;
}

function DonorDetail(props) {
  const {
    assayMetadata, flashed_messages, entityEndpoint,
  } = props;
  const {
    uuid, protocol_url,
    portal_uploaded_protocol_files,
    metadata,
    group_name,
    created_by_user_displayname,
    created_by_user_email,
  } = assayMetadata;

  const shouldDisplaySection = {
    protocols: (portal_uploaded_protocol_files || protocol_url),
    metadata: true,
  };

  // eslint-disable-next-line
  const donorMetadata = metadata && metadata.hasOwnProperty('organ_donor_data')
    ? getDonorMetadata(metadata.organ_donor_data) : {};

  return (
    <DetailLayout shouldDisplaySection={shouldDisplaySection} flashed_messages={flashed_messages}>
      <Summary assayMetadata={assayMetadata} />
      <Metadata entityType={assayMetadata.entity_type} metadata={donorMetadata} />
      <Attribution
        group_name={group_name}
        created_by_user_displayname={created_by_user_displayname}
        created_by_user_email={created_by_user_email}
      />
      <ProvTabs
        uuid={uuid}
        assayMetadata={assayMetadata}
        entityEndpoint={entityEndpoint}
      />
      {shouldDisplaySection.protocols
      && (
      <Protocol
        protocol_url={protocol_url}
        portal_uploaded_protocol_files={portal_uploaded_protocol_files}
      />
      )}
    </DetailLayout>
  );
}

export default DonorDetail;
