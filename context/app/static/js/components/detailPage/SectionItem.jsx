/* eslint-disable react/no-array-index-key */
import React from 'react';
import styled from 'styled-components';
import Typography from '@mui/material/Typography';

const StyledDiv = styled.div`
  margin-left: ${(props) => (props.ml ? '75px' : '0px')};
  ${(props) => props.flexBasis && `flex-basis: ${props.flexBasis};`}
`;

function SectionItem({ children, ml, label, flexBasis, ...rest }) {
  const childrenArray = Array.isArray(children) ? children : [children];
  return (
    <StyledDiv ml={ml} flexBasis={flexBasis} {...rest}>
      <Typography variant="subtitle2" component="h3" color="primary">
        {label}
      </Typography>

      {childrenArray.map((child, i) => (
        <Typography key={`value-${i}`} variant="h6" component="p">
          {child}
        </Typography>
      ))}
    </StyledDiv>
  );
}

export default SectionItem;
