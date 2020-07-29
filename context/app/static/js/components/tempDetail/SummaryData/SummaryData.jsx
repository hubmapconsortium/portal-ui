import React from 'react';
import PropTypes from 'prop-types';

import { Flex, FlexRight, FlexCenterAlign, JsonButton, StyledFileIcon } from './style';
import SummaryItem from '../SummaryItem';
import StatusIcon from '../StatusIcon';

function SummaryData(props) {
  const { entity_type, uuid, status, children } = props;

  return (
    <Flex>
      {children && <FlexCenterAlign>{children}</FlexCenterAlign>}
      <FlexRight>
        {entity_type === 'Dataset' && status && status.length > 0 && (
          <FlexCenterAlign>
            <StatusIcon status={status} />
            <SummaryItem>{status}</SummaryItem>
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
  status: PropTypes.string,
  children: PropTypes.element,
};

SummaryData.defaultProps = {
  status: '',
  children: undefined,
};

export default SummaryData;
