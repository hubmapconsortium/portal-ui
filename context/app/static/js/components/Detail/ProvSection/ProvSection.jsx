import React from 'react';
import PropTypes from 'prop-types';
import Alert from '@material-ui/lab/Alert';

import { readCookie } from 'helpers/functions';
import ProvTabs from '../ProvTabs';
import SectionHeader from '../SectionHeader';
import SectionContainer from '../SectionContainer';

function ProvSection(props) {
  const { uuid, assayMetadata, entityEndpoint } = props;
  const { entity_type } = assayMetadata;

  const [provData, setProvData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function getAndSetProvData() {
      const nexus_token = readCookie('nexus_token');
      const requestInit = nexus_token
        ? {
            headers: {
              Authorization: `Bearer ${nexus_token}`,
            },
          }
        : {};

      const response = await fetch(`${entityEndpoint}/entities/${uuid}/provenance`, requestInit);

      if (!response.ok) {
        console.error('Prov API failed', response);
        setIsLoading(false);
        return;
      }
      const responseProvData = await response.json();
      setProvData(responseProvData);
      setIsLoading(false);
    }
    getAndSetProvData();
  }, [entityEndpoint, uuid]);

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
