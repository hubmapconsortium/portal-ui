import React from 'react';
import Typography from '@material-ui/core/Typography';

import {
  StyledDatasetIcon,
  StyledSampleIcon,
  StyledDonorIcon,
  StyledPaper,
  HoverOverlay,
  FixedWidthDiv,
  Flex,
  TruncatedTypography,
  StyledDivider,
} from './style';

function EntityTile(props) {
  const { uuid, entityType, id, isCurrentEntity, entityData } = props;

  return entityData ? (
    <a href={`/browse/${entityType.toLowerCase()}/${uuid}`}>
      <StyledPaper $isCurrentEntity={isCurrentEntity}>
        <HoverOverlay $isCurrentEntity={isCurrentEntity}>
          <FixedWidthDiv>
            {entityType === 'Dataset' && <StyledDatasetIcon />}
            {entityType === 'Donor' && <StyledDonorIcon />}
            {entityType === 'Sample' && <StyledSampleIcon />}
            <div style={{ minWidth: 0, flexGrow: 1 }}>
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
              {entityType === 'Donor' && 'mapped_metadata' in entityData && (
                <>
                  <Flex>
                    <Typography variant="body2">{entityData.mapped_metadata.gender}</Typography>
                    <StyledDivider flexItem orientation="vertical" />
                    <Typography variant="body2">{entityData.mapped_metadata.age} years</Typography>
                  </Flex>
                  <TruncatedTypography variant="body2">{entityData.mapped_metadata.race}</TruncatedTypography>
                </>
              )}
            </div>
          </FixedWidthDiv>
        </HoverOverlay>
      </StyledPaper>
    </a>
  ) : (
    <></>
  );
}

export default EntityTile;
