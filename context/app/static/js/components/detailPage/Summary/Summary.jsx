import React from 'react';
import PropTypes from 'prop-types';

import { DetailPageSection } from 'js/components/detailPage/style';
import SummaryData from '../SummaryData';
import SummaryBody from '../SummaryBody';

function Summary(props) {
  const {
    hubmap_id,
    entity_type,
    created_timestamp,
    published_timestamp,
    last_modified_timestamp,
    uuid,
    description,
    status,
    children,
    mapped_data_access_level,
    entityCanBeSaved,
    contributors,
    citationTitle,
    doi_url,
    doi,
    collectionName,
    mapped_external_group_name,
  } = props;
  return (
    <DetailPageSection id="summary">
      <SummaryData
        entity_type={entity_type}
        uuid={uuid}
        status={status}
        hubmap_id={hubmap_id}
        mapped_data_access_level={mapped_data_access_level}
        entityCanBeSaved={entityCanBeSaved}
        mapped_external_group_name={mapped_external_group_name}
      >
        {children}
      </SummaryData>
      <SummaryBody
        description={description}
        contributors={contributors}
        citationTitle={citationTitle}
        last_modified_timestamp={last_modified_timestamp}
        created_timestamp={created_timestamp}
        published_timestamp={published_timestamp}
        doi_url={doi_url}
        doi={doi}
        collectionName={collectionName}
      />
    </DetailPageSection>
  );
}

Summary.propTypes = {
  hubmap_id: PropTypes.string.isRequired,
  entity_type: PropTypes.string.isRequired,
  uuid: PropTypes.string.isRequired,
  created_timestamp: PropTypes.number,
  last_modified_timestamp: PropTypes.number,
  description: PropTypes.string,
  status: PropTypes.string,
  mapped_data_access_level: PropTypes.string,
  entityCanBeSaved: PropTypes.bool,
  collectionName: PropTypes.string,
  mapped_external_group_name: PropTypes.string,
};

Summary.defaultProps = {
  created_timestamp: undefined,
  last_modified_timestamp: undefined,
  description: '',
  status: '',
  mapped_data_access_level: '',
  entityCanBeSaved: true,
  collectionName: '',
  mapped_external_group_name: undefined,
};

export default Summary;
