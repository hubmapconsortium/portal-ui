/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import Container from '@material-ui/core/Container';
import VisTabs from './VisTabs';
import RecursiveList from './RecursiveList';
import DetailSummary from './DetailSummary';
import DetailAttribution from './DetailAttribution';
import DetailProtocol from './DetailProtocols';
import DetailMetadata from './DetailMetadata';

function Details(props) {
  const { assayMetadata, provData } = props;
  const { protocol_url, portal_uploaded_protocol_files } = assayMetadata;

  return (
    <Container maxWidth="lg">
      <DetailSummary assayMetadata={assayMetadata} />
      <DetailAttribution assayMetadata={assayMetadata} />
      <DetailMetadata />
      {portal_uploaded_protocol_files || protocol_url
        ? <DetailProtocol assayMetadata={assayMetadata} /> : null}
      <VisTabs provData={provData} assayMetadata={assayMetadata} />
      <RecursiveList property={assayMetadata} propertyName="Root Property" isRoot />
    </Container>
  );
}

Details.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  assayMetadata: PropTypes.object.isRequired,
  provData: PropTypes.object.isRequired,
  /* eslint-enable react/forbid-prop-types */
};

export default Details;
