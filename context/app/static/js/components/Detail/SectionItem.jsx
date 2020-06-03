import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';

const StyledDiv = styled.div`
  margin-left: ${(props) => (props.ml ? '75px' : '0px')};
`;

function SectionItem(props) {
  const { children, label, ml } = props;
  return (
    <StyledDiv ml={ml}>
      <Typography variant="body2" color="primary">
        {label}
      </Typography>
      {children}
    </StyledDiv>
  );
}

export default SectionItem;
