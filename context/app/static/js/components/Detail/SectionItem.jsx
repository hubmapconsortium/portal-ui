/* eslint-disable react/no-array-index-key */
import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';

const StyledDiv = styled.div`
  margin-left: ${(props) => (props.ml ? '75px' : '0px')};
`;

function SectionItem(props) {
  const { childrenArray } = Array.isArray(children) ? children : [children];
  return (
    <StyledDiv ml={ml}>
      <Typography variant="subtitle2" component="h3" color="primary">
        {label}
      </Typography>

      {childrenArray.map((child, i) => (
          <Typography key={`value-${i}`} variant="h6" component="p">
            {child}
          </Typography>
        ))
      )}
    </StyledDiv>
  );
}

export default SectionItem;
