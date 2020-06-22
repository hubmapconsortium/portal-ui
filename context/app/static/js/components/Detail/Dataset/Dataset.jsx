/* eslint-disable camelcase */
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { StyledDivider } from './style';
import ProvTabs from '../ProvTabs';
import Summary from '../Summary';
import Attribution from '../Attribution';
import Protocol from '../Protocol';
import MetadataTable from '../MetadataTable';
import FileTable from '../FileTable';
import Visualization from '../Visualization';
import DetailLayout from '../DetailLayout';

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
  const data_types_string = data_types.constructor.name === 'Array' ? data_types.join(' / ') : data_types;
  return (
    <>
      {data_types && data_types.length > 0 && (
        <AssaySpecificItem>
          <a href={`/assays#${data_types_string}`}>{data_types_string}</a>
        </AssaySpecificItem>
      )}
      <Typography variant="body1">{origin_sample.mapped_organ}</Typography>
    </>
  );
}

function DatasetDetail(props) {
  const { assayMetadata, vitData, assetsEndpoint, entityEndpoint } = props;
  const {
    protocol_url,
    portal_uploaded_protocol_files,
    metadata,
    files,
    uuid,
    data_types,
    origin_sample,
    group_name,
    created_by_user_displayname,
    created_by_user_email,
    display_doi,
    entity_type,
    create_timestamp,
    last_modified_timestamp,
    description,
    status,
  } = assayMetadata;

  const shouldDisplaySection = {
    visualization: 'name' in vitData,
    protocols: Boolean(portal_uploaded_protocol_files || protocol_url),
    metadataTable: metadata && 'metadata' in metadata,
    files: files && files.length > 0,
  };

  return (
    <DetailLayout shouldDisplaySection={shouldDisplaySection}>
      <Summary
        uuid={uuid}
        entity_type={entity_type}
        display_doi={display_doi}
        create_timestamp={create_timestamp}
        last_modified_timestamp={last_modified_timestamp}
        description={description}
        status={status}
      >
        <SummaryData data_types={data_types} origin_sample={origin_sample} />
      </Summary>
      {shouldDisplaySection.visualization && <Visualization vitData={vitData} />}
      <Attribution
        group_name={group_name}
        created_by_user_displayname={created_by_user_displayname}
        created_by_user_email={created_by_user_email}
      />
      <ProvTabs uuid={uuid} assayMetadata={assayMetadata} entityEndpoint={entityEndpoint} />
      {shouldDisplaySection.protocols && (
        <Protocol protocol_url={protocol_url} portal_uploaded_protocol_files={portal_uploaded_protocol_files} />
      )}
      {shouldDisplaySection.metadataTable && <MetadataTable metadata={metadata.metadata} />}
      {shouldDisplaySection.files && <FileTable files={files} assetsEndpoint={assetsEndpoint} uuid={uuid} />}
    </DetailLayout>
  );
}

export default DatasetDetail;
