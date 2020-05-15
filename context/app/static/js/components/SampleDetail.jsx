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

function SampleDetail(props) {
  const { assayMetadata, provData, flashed_messages } = props;
  const {
    protocol_url,
    portal_uploaded_protocol_files,
    organ_type,
    specimen_type,
  } = assayMetadata;

  return (
    <FlexContainer>
      {flashed_messages && flashed_messages.length
        ? <NoticeAlert errors={flashed_messages} /> : null}
      <SpacedContainer maxWidth="lg">
        <DetailSummary assayMetadata={assayMetadata} />
        <DetailMetadata organType={organ_type} specimenType={specimen_type} />
        <DetailAttribution assayMetadata={assayMetadata} />
        <VisTabs provData={provData} assayMetadata={assayMetadata} />
        {portal_uploaded_protocol_files || protocol_url
          ? <DetailProtocol assayMetadata={assayMetadata} /> : null}
      </SpacedContainer>
    </FlexContainer>
  );
}

export default SampleDetail;
