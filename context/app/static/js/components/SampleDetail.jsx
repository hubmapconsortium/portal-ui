/* eslint-disable camelcase */
import React from 'react';
import styled from 'styled-components';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import ProvTabs from './Detail/ProvTabs';
import Summary from './Detail/Summary';
import Attribution from './Detail/Attribution';
import Protocol from './Detail/Protocol';
import Metadata from './Detail/Metadata';
import NoticeAlert from './NoticeAlert';
import SummaryItem from './Detail/SummaryItem';

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
      {origin_sample.organ && origin_sample.organ.length && !organ
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
        <Summary assayMetadata={assayMetadata}>
          <SummaryData organ={organ} specimen_type={specimen_type} origin_sample={origin_sample} />
        </Summary>
        <Metadata organ={organ} specimenType={specimen_type} origin_sample={origin_sample} />
        <Attribution assayMetadata={assayMetadata} />
        <ProvTabs provData={provData} assayMetadata={assayMetadata} />
        {portal_uploaded_protocol_files || protocol_url
          ? <Protocol assayMetadata={assayMetadata} /> : null}
      </SpacedContainer>
    </FlexContainer>
  );
}

export default SampleDetail;
