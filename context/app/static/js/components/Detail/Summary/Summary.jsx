import React from 'react';
import PropTypes from 'prop-types';

import SectionContainer from 'js/shared-styles/sections/SectionContainer';
import SummaryData from '../SummaryData';
import SummaryBody from '../SummaryBody';

function Summary(props) {
  const {
    display_doi,
    entity_type,
    created_timestamp,
    last_modified_timestamp,
    uuid,
    description,
    status,
    children,
    mapped_data_access_level,
    group_name,
    entityCanBeSaved,
    contributors,
    citationTitle,
    doi_url,
    doi,
    collectionName,
  } = props;
  return (
    <SectionContainer id="summary">
      <SummaryData
        entity_type={entity_type}
        uuid={uuid}
        status={status}
        display_doi={display_doi}
        mapped_data_access_level={mapped_data_access_level}
        group_name={group_name}
        entityCanBeSaved={entityCanBeSaved}
      >
        {children}
      </SummaryData>
      <SummaryBody
        description={description}
        contributors={contributors}
        citationTitle={citationTitle}
        last_modified_timestamp={last_modified_timestamp}
        create_timestamp={created_timestamp}
        doi_url={doi_url}
        doi={doi}
        collectionName={collectionName}
      />
    </SectionContainer>
  );
}

Summary.propTypes = {
  display_doi: PropTypes.string.isRequired,
  entity_type: PropTypes.string.isRequired,
  uuid: PropTypes.string.isRequired,
  created_timestamp: PropTypes.number,
  last_modified_timestamp: PropTypes.number,
  description: PropTypes.string,
  status: PropTypes.string,
  mapped_data_access_level: PropTypes.string,
  entityCanBeSaved: PropTypes.bool,
  collectionName: PropTypes.string,
};

Summary.defaultProps = {
  created_timestamp: undefined,
  last_modified_timestamp: undefined,
  description: '',
  status: '',
  mapped_data_access_level: '',
  entityCanBeSaved: true,
  collectionName: '',
};

export default Summary;
