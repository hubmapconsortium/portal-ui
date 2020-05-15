/* eslint-disable camelcase */
import React from 'react';
import styled from 'styled-components';
import Container from '@material-ui/core/Container';
import VisTabs from './VisTabs';
import DetailSummary from './DetailSummary';
import DetailAttribution from './DetailAttribution';
import DetailProtocol from './DetailProtocols';
import DetailMetadata from './DetailMetadata';
import NoticeAlert from './NoticeAlert';

const FlexContainer = styled(Container)`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
`;

const SpacedContainer = styled(FlexContainer)`
    justify-content: space-evenly;
`;

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

  // eslint-disable-next-line
  const donorMetadata = metadata && metadata.hasOwnProperty('organ_donor_data')
    ? getDonorMetadata(metadata.organ_donor_data) : {};

  return (
    <FlexContainer>
      {flashed_messages && flashed_messages.length
        ? <NoticeAlert errors={flashed_messages} /> : null}
      <SpacedContainer maxWidth="lg">
        <DetailSummary assayMetadata={assayMetadata} />
        <DetailMetadata entityType={assayMetadata.entity_type} metadata={donorMetadata} />
        <DetailAttribution assayMetadata={assayMetadata} />
        <VisTabs provData={provData} assayMetadata={assayMetadata} />
        {portal_uploaded_protocol_files || protocol_url
          ? <DetailProtocol assayMetadata={assayMetadata} /> : null}
      </SpacedContainer>
    </FlexContainer>
  );
}

export default DonorDetail;
