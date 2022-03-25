import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import 'intersection-observer';

import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';
import VersionSelect from 'js/components/detailPage/VersionSelect';
import SummaryItem from 'js/components/detailPage/summary/SummaryItem';
import StatusIcon from 'js/components/detailPage/StatusIcon';
import { FlexEnd, StyledTypography } from './style';

function SummaryData(props) {
  const {
    entity_type,
    uuid,
    status,
    mapped_data_access_level,
    hubmap_id,
    children,
    mapped_external_group_name,
  } = props;

  return (
    <>
      <Typography variant="subtitle1" component="h1" color="primary">
        {entity_type}
      </Typography>
      <SpacedSectionButtonRow
        leftText={
          <div>
            <StyledTypography variant="h2">{hubmap_id}</StyledTypography>
            {children && <FlexEnd data-testid="summary-data-parent">{children}</FlexEnd>}
          </div>
        }
        buttons={
          <FlexEnd>
            {['Dataset', 'Support'].includes(entity_type) && (
              <>
                <SummaryItem statusIcon={<StatusIcon status={status} />}>{status}</SummaryItem>
                <SummaryItem>{`${mapped_data_access_level} Access`}</SummaryItem>
                {mapped_external_group_name && <SummaryItem>{mapped_external_group_name}</SummaryItem>}
              </>
            )}
            <FlexEnd>{['Dataset', 'Support'].includes(entity_type) && <VersionSelect uuid={uuid} />}</FlexEnd>
          </FlexEnd>
        }
      />
    </>
  );
}

SummaryData.propTypes = {
  hubmap_id: PropTypes.string.isRequired,
  entity_type: PropTypes.string.isRequired,
  uuid: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  mapped_data_access_level: PropTypes.string.isRequired,
  mapped_external_group_name: PropTypes.string,
};

SummaryData.defaultProps = {
  mapped_external_group_name: undefined,
};

export default SummaryData;
