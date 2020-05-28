/* eslint-disable camelcase */
import React from 'react';
import Typography from '@material-ui/core/Typography';
import ProvTabs from './Detail/ProvTabs';
import Summary from './Detail/Summary';
import Attribution from './Detail/Attribution';
import Protocol from './Detail/Protocol';
import Metadata from './Detail/Metadata';
import SummaryItem from './Detail/SummaryItem';
import DetailLayout from './Detail/DetailLayout';


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
  const { assayMetadata, flashed_messages, entityEndpoint } = props;
  const {
    uuid,
    protocol_url,
    portal_uploaded_protocol_files,
    organ,
    specimen_type,
    origin_sample,
  } = assayMetadata;

  const shouldDisplay = {
    protocols: (portal_uploaded_protocol_files || protocol_url),
    metadata: true,
  };

  return (
    <DetailLayout shouldDisplay={shouldDisplay} flashed_messages={flashed_messages}>
      <Summary assayMetadata={assayMetadata}>
        <SummaryData organ={organ} specimen_type={specimen_type} origin_sample={origin_sample} />
      </Summary>
      <Metadata organ={organ} specimenType={specimen_type} origin_sample={origin_sample} />
      <Attribution assayMetadata={assayMetadata} />
      <ProvTabs
        uuid={uuid}
        assayMetadata={assayMetadata}
        entityEndpoint={entityEndpoint}
      />
      {shouldDisplay.protocols && <Protocol assayMetadata={assayMetadata} />}
    </DetailLayout>
  );
}

export default SampleDetail;
