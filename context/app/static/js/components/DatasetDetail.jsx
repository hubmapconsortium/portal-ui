/* eslint-disable camelcase */
import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ProvTabs from './Detail/ProvTabs';
import Summary from './Detail/Summary';
import Attribution from './Detail/Attribution';
import Protocol from './Detail/Protocol';
import MetadataTable from './Detail/MetadataTable';
import FileTable from './Detail/FileTable';
import Visualization from './Detail/Visualization';
import DetailLayout from './Detail/DetailLayout';

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
      {(data_types && data_types.length)
      && <AssaySpecificItem>{data_types.constructor.name === 'Array' ? data_types.join(' / ') : data_types}</AssaySpecificItem>}
      {(origin_sample.organ && origin_sample.organ.length)
      && <Typography variant="body1">{origin_sample.organ}</Typography>}
    </>
  );
}

function DatasetDetail(props) {
  const {
    assayMetadata,
    provData,
    vitData,
    assetsEndpoint,
  } = props;
  const {
    protocol_url,
    portal_uploaded_protocol_files,
    metadata,
    files,
    uuid,
    data_types,
    origin_sample,
  } = assayMetadata;

  const displayViz = 'name' in vitData;
  const displayProtocol = (portal_uploaded_protocol_files || protocol_url);
  const displayMetadataTable = (metadata && metadata.metadata);
  const displayFiles = (files && files.length);

  return (
    <DetailLayout
      displayViz={displayViz}
      displayProtocol={displayProtocol}
      displayMetadataTable={displayMetadataTable}
      displayFiles={displayFiles}
    >
      <Summary assayMetadata={assayMetadata}>
        <SummaryData data_types={data_types} origin_sample={origin_sample} />
      </Summary>
      {displayViz && <Visualization vitData={vitData} />}
      <Attribution assayMetadata={assayMetadata} />
      <ProvTabs provData={provData} assayMetadata={assayMetadata} />
      {displayProtocol && <Protocol assayMetadata={assayMetadata} />}
      {displayMetadataTable && <MetadataTable metadata={metadata.metadata} />}
      {displayFiles && <FileTable files={files} assetsEndpoint={assetsEndpoint} uuid={uuid} />}
    </DetailLayout>
  );
}

export default DatasetDetail;
