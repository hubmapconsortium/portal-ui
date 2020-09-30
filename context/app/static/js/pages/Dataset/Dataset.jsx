import React from 'react';
import Typography from '@material-ui/core/Typography';

import { LightBlueLink } from 'js/shared-styles/Links';
import Files from 'js/components/files/Files';
import ProvSection from 'js/components/Detail/provenance/ProvSection';
import Summary from 'js/components/Detail/Summary';
import Attribution from 'js/components/Detail/Attribution';
import Protocol from 'js/components/Detail/Protocol';
import MetadataTable from 'js/components/Detail/MetadataTable';
import VisualizationWrapper from 'js/components/Detail/Visualization/VisualizationWrapper';
import DetailLayout from 'js/components/Detail/DetailLayout';
import SummaryItem from 'js/components/Detail/SummaryItem';
import useSendUUIDEvent from 'js/components/Detail/useSendUUIDEvent';

// TODO use this context for components other than FileBrowser
import DetailContext from 'js/components/Detail/context';
import { getSectionOrder } from 'js/components/Detail/utils';

function SummaryDataChildren(props) {
  const { mapped_data_types, origin_sample } = props;
  return (
    <>
      <SummaryItem>
        <LightBlueLink variant="h6" href="/docs/assays" underline="none">
          {mapped_data_types}
        </LightBlueLink>
      </SummaryItem>
      <Typography variant="h6" component="p">
        {origin_sample.mapped_organ}
      </Typography>
    </>
  );
}

function DatasetDetail(props) {
  const { assayMetadata, vitData } = props;
  const {
    protocol_url,
    metadata,
    files,
    uuid,
    data_types,
    mapped_data_types,
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
    mapped_data_access_level,
  } = assayMetadata;

  const shouldDisplaySection = {
    visualization: 'name' in vitData || (vitData[0] && 'name' in vitData[0]),
    protocols: Boolean(protocol_url),
    metadata: metadata && 'metadata' in metadata,
    files: true,
  };

  const sectionOrder = getSectionOrder(
    ['summary', 'visualization', 'attribution', 'provenance', 'protocols', 'metadata', 'files'],
    shouldDisplaySection,
  );

  useSendUUIDEvent(entity_type, uuid);

  // TODO: When all environments are clean, data_types array fallbacks shouldn't be needed.
  return (
    <DetailContext.Provider value={{ display_doi, uuid, mapped_data_access_level }}>
      <DetailLayout sectionOrder={sectionOrder}>
        <Summary
          uuid={uuid}
          entity_type={entity_type}
          display_doi={display_doi}
          create_timestamp={create_timestamp}
          last_modified_timestamp={last_modified_timestamp}
          description={description}
          status={status}
          mapped_data_access_level={mapped_data_access_level}
        >
          <SummaryDataChildren
            data_types={data_types || []}
            mapped_data_types={mapped_data_types || []}
            origin_sample={origin_sample}
          />
        </Summary>
        {shouldDisplaySection.visualization && <VisualizationWrapper vitData={vitData} />}
        <Attribution
          group_name={group_name}
          created_by_user_displayname={created_by_user_displayname}
          created_by_user_email={created_by_user_email}
        />
        <ProvSection uuid={uuid} assayMetadata={assayMetadata} />
        {shouldDisplaySection.protocols && <Protocol protocol_url={protocol_url} />}
        {shouldDisplaySection.metadata && <MetadataTable metadata={metadata.metadata} display_doi={display_doi} />}
        <Files files={files} uuid={uuid} display_doi={display_doi} />
      </DetailLayout>
    </DetailContext.Provider>
  );
}

export default DatasetDetail;
