import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import VisTabs from './VisTabs';
import RecursiveList from './RecursiveList';
import DetailSummary from './DetailSummary';
import DetailAttribution from './DetailAttribution';

function Details(props) {
  const { assayMetadata, provData } = props;

  return (
    <Container maxWidth="lg">
      <DetailSummary assayMetadata={assayMetadata} />
      <DetailAttribution assayMetadata={assayMetadata} />
      <Box mt={2} mb={2}>
        <Paper>
          <VisTabs provData={provData} assayMetadata={assayMetadata} />
        </Paper>
      </Box>
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
