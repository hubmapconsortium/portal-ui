import React from 'react';
import Typography from '@material-ui/core/Typography';
import ProvTabs from '../ProvTabs';
import Summary from '../Summary';
import Attribution from '../Attribution';
import Protocol from '../Protocol';
import Metadata from '../Metadata';
import SummaryItem from '../SummaryItem';
import DetailLayout from '../DetailLayout';

import DetailContext from '../context';

function SampleDetail(props) {
  const { assayMetadata, entityEndpoint, elasticsearchEndpoint } = props;
  const {
    uuid,
    protocol_url,
    portal_uploaded_protocol_files,
    mapped_specimen_type,
    origin_sample,
    group_name,
    created_by_user_displayname,
    created_by_user_email,
    display_doi,
    entity_type,
    create_timestamp,
    last_modified_timestamp,
    description,
  } = assayMetadata;

  const shouldDisplaySection = {
    protocols: Boolean(portal_uploaded_protocol_files || protocol_url),
    metadata: true,
  };

  return (
    <DetailContext.Provider value={{ elasticsearchEndpoint, display_doi, uuid }}>
      <DetailLayout shouldDisplaySection={shouldDisplaySection}>
        <Summary
          uuid={uuid}
          entity_type={entity_type}
          display_doi={display_doi}
          create_timestamp={create_timestamp}
          last_modified_timestamp={last_modified_timestamp}
          description={description}
        >
          <SummaryItem>{origin_sample.mapped_organ}</SummaryItem>
          <Typography variant="body1">{mapped_specimen_type}</Typography>
        </Summary>
        <Metadata entity_type={entity_type} specimenType={mapped_specimen_type} origin_sample={origin_sample} />
        <Attribution
          group_name={group_name}
          created_by_user_displayname={created_by_user_displayname}
          created_by_user_email={created_by_user_email}
        />
        <ProvTabs uuid={uuid} assayMetadata={assayMetadata} entityEndpoint={entityEndpoint} />
        {shouldDisplaySection.protocols && (
          <Protocol protocol_url={protocol_url} portal_uploaded_protocol_files={portal_uploaded_protocol_files} />
        )}
      </DetailLayout>
    </DetailContext.Provider>
  );
}

export default SampleDetail;
