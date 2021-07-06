import React from 'react';
import PropTypes from 'prop-types';

import SectionContainer from 'js/shared-styles/sections/SectionContainer';
import DetailDescription from 'js/components/Detail/DetailDescription';
import SummaryData from '../SummaryData';

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
    collectionName,
    mapped_data_access_level,
    group_name,
    entityCanBeSaved,
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
      <DetailDescription
        subtitle={collectionName}
        description={description}
        createdTimestamp={created_timestamp}
        modifiedTimestamp={last_modified_timestamp}
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
  collectionName: PropTypes.string,
  mapped_data_access_level: PropTypes.string,
  entityCanBeSaved: PropTypes.bool,
};

Summary.defaultProps = {
  created_timestamp: undefined,
  last_modified_timestamp: undefined,
  description: '',
  status: '',
  mapped_data_access_level: '',
  collectionName: '',
  entityCanBeSaved: true,
};

export default Summary;
