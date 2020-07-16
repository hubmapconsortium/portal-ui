import React from 'react';
import Typography from '@material-ui/core/Typography';

import { Flex, TruncatedTypography, StyledDivider, StyledDiv } from './style';

function EntityTileTopText(props) {
  const { entity_type, id, invertColors, entityData } = props;

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
            <Typography variant="body2">{entityData.mapped_metadata.gender}</Typography>
            <StyledDivider flexItem orientation="vertical" $invertColors={invertColors} />
            <Typography variant="body2">{entityData.mapped_metadata.age} years</Typography>
          </Flex>
          <TruncatedTypography variant="body2">{entityData.mapped_metadata.race}</TruncatedTypography>
        </>
      )}
    </StyledDiv>
  );
}

export default EntityTileTopText;
