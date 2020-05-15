/* eslint-disable camelcase */
import React from 'react';
import styled from 'styled-components';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { Vitessce } from 'vitessce';
import VisTabs from './VisTabs';
import DetailSummary from './DetailSummary';
import DetailAttribution from './DetailAttribution';
import DetailProtocol from './DetailProtocols';
import NoticeAlert from './NoticeAlert';
import DetailMetadataTable from './DetailMetadataTable';
import DetailFileTable from './DetailFileTable';
import 'vitessce/build-lib/es/production/static/css/index.css';

const FlexContainer = styled(Container)`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
`;

const SpacedContainer = styled(FlexContainer)`
    justify-content: space-evenly;
`;

const StyledDivider = styled(Divider)`
  margin-left: 5px;
  margin-right: 5px;
  height: 15px;
  background-color: #444A65;
  align-self:center;
`;


function AssaySpecificItem(props) {
  const { children } = props;
  return (
    <>
      <Typography variant="body1">{children}</Typography>
      <StyledDivider orientation="vertical" flexItem />
    </>
  );
}

function SummaryData(props) {
  const { data_types, origin_sample } = props;
  return (
    <>
      {data_types && data_types.length
        ? (<AssaySpecificItem>{data_types.constructor.name === 'Array' ? data_types.join(' / ') : data_types}</AssaySpecificItem>) : null}
      {origin_sample.organ && origin_sample.organ.length
        ? (<Typography variant="body1">{origin_sample.organ}</Typography>) : null}
    </>
  );
}

function DatasetDetail(props) {
  const {
    assayMetadata,
    provData,
    vitData,
    flashed_messages,
    assetsEndpoint,
  } = props;
  const {
    protocol_url, portal_uploaded_protocol_files, metadata, files, uuid, data_types, origin_sample,
  } = assayMetadata;
  return (
    <FlexContainer>
      {flashed_messages && flashed_messages.length
        ? <NoticeAlert errors={flashed_messages} />
        : null}
      <SpacedContainer maxWidth="lg">
        <DetailSummary assayMetadata={assayMetadata}>
          <SummaryData data_types={data_types} origin_sample={origin_sample} />
        </DetailSummary>
        {'name' in vitData
          ? <Vitessce rowHeight={100} config={vitData} theme="light" />
          : null}
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
