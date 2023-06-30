import React, { Children } from 'react';

import { StyledPaper, StyledDivider } from './style';

function SectionFooter({ children }) {
  const arrayChildren = Children.toArray(children);
  return (
    <StyledPaper>
      {arrayChildren.map((child, index) => (
        <>
          {index !== 0 && <StyledDivider orientation="vertical" flexItem />}
          {child}
        </>
      ))}
    </StyledPaper>
  );
}

export default SectionFooter;
