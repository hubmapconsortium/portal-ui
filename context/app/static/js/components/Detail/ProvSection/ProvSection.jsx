import React from 'react';
import PropTypes from 'prop-types';
import Alert from '@material-ui/lab/Alert';

import useProvData from 'js/hooks/useProvData';
import ProvTabs from '../ProvTabs';
import SectionHeader from '../SectionHeader';
import SectionContainer from '../SectionContainer';

function ProvSection(props) {
  const { uuid, assayMetadata, entityEndpoint } = props;
  const { entity_type } = assayMetadata;

  const { provData, isLoading } = useProvData(uuid, entityEndpoint);

  if (isLoading) {
    return (
      <SectionContainer id="provenance">
        <SectionHeader>Provenance</SectionHeader>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer id="provenance">
      <SectionHeader>Provenance</SectionHeader>
      {provData ? (
        <ProvTabs uuid={uuid} assayMetadata={assayMetadata} provData={provData} />
      ) : (
        <Alert variant="filled" severity="warning">
          {`We were unable to retrieve provenance information for this ${entity_type.toLowerCase()}.`}
        </Alert>
      )}
    </SectionContainer>
  );
}

ProvSection.propTypes = {
  uuid: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  assayMetadata: PropTypes.object.isRequired,
  entityEndpoint: PropTypes.string.isRequired,
};

export default ProvSection;
