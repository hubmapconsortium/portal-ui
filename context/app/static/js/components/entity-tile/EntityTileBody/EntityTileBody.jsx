import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

import { Flex, TruncatedTypography, StyledDivider, StyledDiv } from './style';

function EntityTileBody(props) {
  const { entity_type, id, entityData, invertColors } = props;

  return (
    <StyledDiv>
      <Typography component="h4" variant="h6">
        {id}
      </Typography>
      {'origin_sample' in entityData && (
        <TruncatedTypography variant="body2">{entityData.origin_sample.mapped_organ}</TruncatedTypography>
      )}
      {'mapped_specimen_type' in entityData && (
        <TruncatedTypography variant="body2">{entityData.mapped_specimen_type}</TruncatedTypography>
      )}
      {'mapped_data_types' in entityData && (
        <TruncatedTypography variant="body2">{entityData.mapped_data_types.join(', ')}</TruncatedTypography>
      )}
      {entity_type === 'Donor' && 'mapped_metadata' in entityData && (
        <>
          <Flex>
            <Typography variant="body2">{entityData.mapped_metadata.sex}</Typography>
            <StyledDivider flexItem orientation="vertical" $invertColors={invertColors} />
            <Typography variant="body2">
              {entityData.mapped_metadata.age_value} {entityData.mapped_metadata.age_unit}
            </Typography>
          </Flex>
          <TruncatedTypography variant="body2">{entityData.mapped_metadata.race.join(', ')}</TruncatedTypography>
        </>
      )}
    </StyledDiv>
  );
}

EntityTileBody.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  entityData: PropTypes.object.isRequired,
  entity_type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  invertColors: PropTypes.bool,
};

EntityTileBody.defaultProps = {
  invertColors: false,
};

export default EntityTileBody;
