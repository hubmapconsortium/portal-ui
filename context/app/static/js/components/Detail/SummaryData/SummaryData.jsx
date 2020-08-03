import React from 'react';
import PropTypes from 'prop-types';

import { capitalizeString } from 'helpers/functions';
import { Flex, FlexRight, FlexCenterAlign, JsonButton, StyledFileIcon } from './style';
import SummaryItem from '../SummaryItem';
import StatusIcon from '../StatusIcon';

function SummaryData(props) {
  const { entity_type, uuid, status, data_access_level, children } = props;

  return (
    <Flex>
      {children && <FlexCenterAlign>{children}</FlexCenterAlign>}
      <FlexRight>
        {entity_type === 'Dataset' && (
          <FlexCenterAlign>
            <StatusIcon status={status} />
            <SummaryItem>{status}</SummaryItem>
            <SummaryItem>{`${capitalizeString(data_access_level)} Access`}</SummaryItem>
          </FlexCenterAlign>
        )}
        <JsonButton href={`/browse/${entity_type.toLowerCase()}/${uuid}.json`} target="_blank" component="a">
          <StyledFileIcon color="primary" />
        </JsonButton>
      </FlexRight>
    </Flex>
  );
}

SummaryData.propTypes = {
  entity_type: PropTypes.string.isRequired,
  uuid: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  data_access_level: PropTypes.string.isRequired,
  children: PropTypes.element,
};

SummaryData.defaultProps = {
  children: undefined,
};

export default SummaryData;
