/* eslint-disable camelcase */
import React from 'react';
import styled from 'styled-components';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ProvTabs from './Detail/ProvTabs';
import Summary from './Detail/Summary';
import Attribution from './Detail/Attribution';
import Protocol from './Detail/Protocol';
import NoticeAlert from './NoticeAlert';
import MetadataTable from './Detail/MetadataTable';
import FileTable from './Detail/FileTable';
import Visualization from './Detail/Visualization';
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
    vitData,
    flashed_messages,
    assetsEndpoint,
    entityEndpoint,
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
        <Summary assayMetadata={assayMetadata}>
          <SummaryData data_types={data_types} origin_sample={origin_sample} />
        </Summary>
        {'name' in vitData
          ? <Visualization vitData={vitData} />
          : null}
        <Attribution assayMetadata={assayMetadata} />
        <ProvTabs
          uuid={uuid}
          assayMetadata={assayMetadata}
          entityEndpoint={entityEndpoint}
        />
        {portal_uploaded_protocol_files || protocol_url
          ? <Protocol assayMetadata={assayMetadata} />
          : null}
        {metadata.metadata
          ? <MetadataTable metadata={metadata.metadata} />
          : null}
        {files
          ? <FileTable files={files} assetsEndpoint={assetsEndpoint} uuid={uuid} />
          : null}
      </SpacedContainer>
    </FlexContainer>
  );
}

export default DatasetDetail;
