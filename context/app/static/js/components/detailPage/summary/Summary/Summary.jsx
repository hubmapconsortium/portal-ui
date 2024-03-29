import React from 'react';
import PropTypes from 'prop-types';
import { useFlaskDataContext } from 'js/components/Contexts';
import { DetailPageSection } from 'js/components/detailPage/style';
import SummaryData from 'js/components/detailPage/summary/SummaryData';
import SummaryBody from 'js/components/detailPage/summary/SummaryBody';

function Summary({
  published_timestamp,
  status,
  children,
  mapped_data_access_level,
  entityTypeDisplay,
  entityCanBeSaved,
  contributors,
  citationTitle,
  doi_url,
  doi,
  collectionName,
  mapped_external_group_name,
  bottomFold,
}) {
  const {
    entity: { uuid, hubmap_id, entity_type, created_timestamp, last_modified_timestamp, description },
  } = useFlaskDataContext();

  return (
    <DetailPageSection id="summary">
      <SummaryData
        title={hubmap_id}
        entityTypeDisplay={entityTypeDisplay}
        entity_type={entity_type}
        uuid={uuid}
        status={status}
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
      {bottomFold}
    </DetailPageSection>
  );
}

Summary.propTypes = {
  status: PropTypes.string,
  mapped_data_access_level: PropTypes.string,
  entityCanBeSaved: PropTypes.bool,
  collectionName: PropTypes.string,
  mapped_external_group_name: PropTypes.string,
};

Summary.defaultProps = {
  status: '',
  mapped_data_access_level: '',
  entityCanBeSaved: true,
  collectionName: '',
  mapped_external_group_name: undefined,
};

export default Summary;
