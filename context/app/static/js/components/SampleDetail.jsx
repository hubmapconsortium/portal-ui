/* eslint-disable camelcase */
import React from 'react';
import styled from 'styled-components';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import VisTabs from './VisTabs';
import DetailSummary from './DetailSummary';
import DetailAttribution from './DetailAttribution';
import DetailProtocol from './DetailProtocols';
import DetailMetadata from './DetailMetadata';
import NoticeAlert from './NoticeAlert';
import SummaryItem from './SummaryItem';

const FlexContainer = styled(Container)`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
`;

const SpacedContainer = styled(FlexContainer)`
    justify-content: space-evenly;
`;

function SummaryData(props) {
  const { organ, origin_sample, specimen_type } = props;
  return (
    <>
      {organ && organ.length
        ? (<SummaryItem>{organ}</SummaryItem>) : null}
      {origin_sample.organ && origin_sample.organ.length
        ? (<SummaryItem>{origin_sample.organ}</SummaryItem>) : null}
      {specimen_type && specimen_type.length
        ? (<Typography variant="body1">{specimen_type}</Typography>) : null}
    </>
  );
}

function SampleDetail(props) {
  const { assayMetadata, provData, flashed_messages } = props;
  const {
    protocol_url,
    portal_uploaded_protocol_files,
    organ,
    specimen_type,
    origin_sample,
  } = assayMetadata;

  return (
    <FlexContainer>
      {flashed_messages && flashed_messages.length
        ? <NoticeAlert errors={flashed_messages} /> : null}
      <SpacedContainer maxWidth="lg">
        <DetailSummary assayMetadata={assayMetadata}>
          <SummaryData organ={organ} specimen_type={specimen_type} origin_sample={origin_sample} />
        </DetailSummary>
        <DetailMetadata organ={organ} specimenType={specimen_type} />
        <DetailAttribution assayMetadata={assayMetadata} />
        <VisTabs provData={provData} assayMetadata={assayMetadata} />
        {portal_uploaded_protocol_files || protocol_url
          ? <DetailProtocol assayMetadata={assayMetadata} /> : null}
      </SpacedContainer>
    </FlexContainer>
  );
}

export default SampleDetail;
