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
    assayMetadata, provData, flashed_messages,
  } = props;
  const { protocol_url, portal_uploaded_protocol_files, metadata } = assayMetadata;

  const displayProtocol = (portal_uploaded_protocol_files || protocol_url);

  // eslint-disable-next-line
  const donorMetadata = metadata && metadata.hasOwnProperty('organ_donor_data')
    ? getDonorMetadata(metadata.organ_donor_data) : {};

  return (
    <DetailLayout displayProtocol displayMetadata flashed_messages={flashed_messages}>
      <Summary assayMetadata={assayMetadata} />
      <Metadata entityType={assayMetadata.entity_type} metadata={donorMetadata} />
      <Attribution assayMetadata={assayMetadata} />
      <ProvTabs provData={provData} assayMetadata={assayMetadata} />
      {displayProtocol && <Protocol assayMetadata={assayMetadata} />}
    </DetailLayout>
  );
}

export default DonorDetail;
