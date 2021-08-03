import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { AppContext } from 'js/components/Providers';
import useProvData from 'js/hooks/useProvData';
import { Alert } from 'js/shared-styles/alerts';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';
import ProvTabs from '../ProvTabs';

function ProvSection(props) {
  const { uuid, assayMetadata, visLiftedUUID } = props;
  const { entity_type } = assayMetadata;
  const { nexusToken, entityEndpoint } = useContext(AppContext);
  const { provData, isLoading } = useProvData(uuid, entityEndpoint, nexusToken);

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
      <p>TODO: visLiftedUUID: {visLiftedUUID}</p>
      {provData ? (
        <ProvTabs uuid={uuid} assayMetadata={assayMetadata} provData={provData} />
      ) : (
        <Alert severity="warning">
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
};

export default ProvSection;
