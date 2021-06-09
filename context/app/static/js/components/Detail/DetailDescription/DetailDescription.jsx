import React from 'react';
import Typography from '@material-ui/core/Typography';
import format from 'date-fns/format';

import SectionItem from '../SectionItem';
import { FlexColumnRight, StyledPaper, StyledSectionItem } from './style';

function DetailDescription({ subtitle, description, createdTimestamp, modifiedTimestamp }) {
  const dateFormat = 'MMMM dd, yyyy';
  const formattedCreationDate = createdTimestamp ? format(createdTimestamp, dateFormat) : 'Undefined';
  const formattedModificationDate = modifiedTimestamp ? format(modifiedTimestamp, dateFormat) : 'Undefined';
  return (
    <StyledPaper>
      <div>
        {subtitle && (
          <Typography color="primary" variant="subtitle1" component="p">
            {subtitle}
          </Typography>
        )}
        <Typography variant="body1">{description || 'No description defined'}</Typography>
      </div>

      <FlexColumnRight>
        <StyledSectionItem label="Creation Date">{formattedCreationDate}</StyledSectionItem>
        <SectionItem label="Modification Date">{formattedModificationDate}</SectionItem>
      </FlexColumnRight>
    </StyledPaper>
  );
}

export default DetailDescription;
