/* eslint-disable camelcase */
import React from 'react';
import styled from 'styled-components';
import Container from '@material-ui/core/Container';
import VisTabs from './VisTabs';
import DetailSummary from './DetailSummary';
import DetailAttribution from './DetailAttribution';
import DetailProtocol from './DetailProtocols';
import NoticeAlert from './NoticeAlert';
import DetailMetadataTable from './DetailMetadataTable';
import DetailFileTable from './DetailFileTable';

const FlexContainer = styled(Container)`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
`;

const SpacedContainer = styled(FlexContainer)`
    justify-content: space-evenly;
`;

function DatasetDetail(props) {
  const {
    assayMetadata,
    provData,
    flashed_messages,
    assetsEndpoint,
  } = props;
  const {
    protocol_url, portal_uploaded_protocol_files, metadata, files, uuid,
  } = assayMetadata;
  return (
    <FlexContainer>
      {flashed_messages && flashed_messages.length
        ? <NoticeAlert errors={flashed_messages} />
        : null}
      <SpacedContainer maxWidth="lg">
        <DetailSummary assayMetadata={assayMetadata} />
        <DetailAttribution assayMetadata={assayMetadata} />
        <VisTabs provData={provData} assayMetadata={assayMetadata} />
        {portal_uploaded_protocol_files || protocol_url
          ? <DetailProtocol assayMetadata={assayMetadata} />
          : null}
        {metadata.metadata
          ? <DetailMetadataTable metadata={metadata.metadata} />
          : null}
        {files
          ? <DetailFileTable files={files} assetsEndpoint={assetsEndpoint} uuid={uuid} />
          : null}
      </SpacedContainer>
    </FlexContainer>
  );
}

export default DatasetDetail;
