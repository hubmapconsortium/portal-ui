import React, { Fragment } from 'react';

import { StyledPaper, StyledDivider, StyledTypography } from './style';

function SectionFooter({ items }) {
  return (
    <StyledPaper>
      {items.map(({ key, component }, index) => (
        <Fragment key={key}>
          {index !== 0 && <StyledDivider orientation="vertical" flexItem />}
          <StyledTypography variant="caption">{component}</StyledTypography>
        </Fragment>
      ))}
    </StyledPaper>
  );
}

export default SectionFooter;
