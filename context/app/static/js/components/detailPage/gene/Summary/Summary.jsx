import React from 'react';
import { DetailPageSection } from 'js/components/detailPage/style';
import SummaryBody from 'js/components/detailPage/gene/SummaryBody/SummaryBody';

function Summary() {
  return (
    <DetailPageSection id="summary">
      <SummaryBody />
    </DetailPageSection>
  );
}

Summary.propTypes = {};

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
