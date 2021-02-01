import React from 'react';
import Typography from '@material-ui/core/Typography';
import format from 'date-fns/format';

import SectionItem from '../SectionItem';
import { FlexColumnRight, StyledPaper } from './style';

function DetailDescription({ subtitle, description, createdTimestamp, modifiedTimestamp }) {
  const dateFormat = 'MMMM d, yyyy';
  const formattedCreationDate = format(createdTimestamp, dateFormat);
  const formattedModificationDate = format(modifiedTimestamp, dateFormat);
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
        <SectionItem label="Creation Date">{formattedCreationDate}</SectionItem>
        <SectionItem label="Modification Date">{formattedModificationDate}</SectionItem>
      </FlexColumnRight>
    </StyledPaper>
  );
}

export default DetailDescription;
