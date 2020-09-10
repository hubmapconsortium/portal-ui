import React from 'react';
import Typography from '@material-ui/core/Typography';
import ProvSection from '../ProvSection';
import Summary from '../Summary';
import Attribution from '../Attribution';
import Protocol from '../Protocol';
import SummaryItem from '../SummaryItem';
import DetailLayout from '../DetailLayout';
import MetadataTable from '../MetadataTable';
import SampleTissue from '../SampleTissue';
import useSendUUIDEvent from '../useSendUUIDEvent';

import DetailContext from '../context';
import { getSectionOrder } from '../utils';

function SampleDetail(props) {
  const { assayMetadata } = props;
  const {
    uuid,
    protocol_url,
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
    metadata,
  } = assayMetadata;

  const { mapped_organ } = origin_sample;

  const shouldDisplaySection = {
    protocols: Boolean(protocol_url),
    tissue: true,
    metadata: 'metadata' in assayMetadata,
  };

  const sectionOrder = getSectionOrder(
    ['summary', 'tissue', 'attribution', 'provenance', 'protocols', 'metadata'],
    shouldDisplaySection,
  );

  useSendUUIDEvent(entity_type, uuid);

  return (
    <DetailContext.Provider value={{ display_doi, uuid }}>
      <DetailLayout sectionOrder={sectionOrder}>
        <Summary
          uuid={uuid}
          entity_type={entity_type}
          display_doi={display_doi}
          create_timestamp={create_timestamp}
          last_modified_timestamp={last_modified_timestamp}
          description={description}
        >
          <SummaryItem>{mapped_organ}</SummaryItem>
          <Typography variant="h6" component="p">
            {mapped_specimen_type}
          </Typography>
        </Summary>
        <SampleTissue mapped_specimen_type={mapped_specimen_type} mapped_organ={mapped_organ} />
        <Attribution
          group_name={group_name}
          created_by_user_displayname={created_by_user_displayname}
          created_by_user_email={created_by_user_email}
        />
        <ProvSection uuid={uuid} assayMetadata={assayMetadata} />
        {shouldDisplaySection.protocols && <Protocol protocol_url={protocol_url} />}
        {shouldDisplaySection.metadata && <MetadataTable metadata={metadata} display_doi={display_doi} />}
      </DetailLayout>
    </DetailContext.Provider>
  );
}

export default SampleDetail;
