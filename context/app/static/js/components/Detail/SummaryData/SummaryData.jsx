import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

import { SecondaryTooltip } from 'js/shared-styles/tooltips';
import { Flex, FlexRight, FlexEnd, JsonButton, StyledFileIcon, StyledTypography } from './style';
import SummaryItem from '../SummaryItem';
import StatusIcon from '../StatusIcon';

function SummaryData(props) {
  const { entity_type, uuid, status, mapped_data_access_level, display_doi, children } = props;
  return (
    <>
      <Typography variant="subtitle1" component="h1" color="primary">
        {entity_type}
      </Typography>
      <Flex>
        <div>
          <StyledTypography variant="h2">{display_doi}</StyledTypography>
          {children && <FlexEnd data-testid="summary-data-parent">{children}</FlexEnd>}
        </div>
        <FlexRight>
          {entity_type === 'Dataset' && (
            <FlexEnd>
              <SummaryItem statusIcon={<StatusIcon status={status} />}>{status}</SummaryItem>
              <SummaryItem>{`${mapped_data_access_level} Access`}</SummaryItem>
            </FlexEnd>
          )}
          <FlexEnd>
            <SecondaryTooltip title="View JSON">
              <JsonButton href={`/browse/${entity_type.toLowerCase()}/${uuid}.json`} target="_blank" component="a">
                <StyledFileIcon color="primary" />
              </JsonButton>
            </SecondaryTooltip>
          </FlexEnd>
        </FlexRight>
      </Flex>
    </>
  );
}

SummaryData.propTypes = {
  entity_type: PropTypes.string.isRequired,
  uuid: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  mapped_data_access_level: PropTypes.string.isRequired,
  children: PropTypes.element,
};

SummaryData.defaultProps = {
  children: undefined,
};

export default SummaryData;
