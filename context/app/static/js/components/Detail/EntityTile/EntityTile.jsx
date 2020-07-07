import React, { useContext } from 'react';
import Typography from '@material-ui/core/Typography';

import useEntityData from 'hooks/useEntityData';
import DetailContext from '../context';
import {
  StyledDatasetIcon,
  StyledSampleIcon,
  StyledDonorIcon,
  StyledPaper,
  FixedWidthDiv,
  Flex,
  TruncatedTypography,
  StyledDivider,
} from './style';

function EntityTile(props) {
  const { uuid, entityType, id } = props;
  const { elasticsearchEndpoint } = useContext(DetailContext);

  const entityData = useEntityData(uuid, elasticsearchEndpoint);

  return entityData ? (
    <a href={`/browse/${entityType.toLowerCase()}/${uuid}`}>
      <StyledPaper>
        <FixedWidthDiv>
          {entityType === 'Dataset' && <StyledDatasetIcon color="primary" />}
          {entityType === 'Donor' && <StyledDonorIcon color="primary" />}
          {entityType === 'Sample' && <StyledSampleIcon color="primary" />}
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
      </StyledPaper>
    </a>
  ) : (
    <></>
  );
}

export default EntityTile;
