import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';

const StyledDiv = styled.div`
  display: flex;
`;

function SummaryItem(props) {
  const { children, statusIcon } = props;
  return (
    <StyledDiv>
      {statusIcon}
      <Typography variant="h6" component="p">
        {children}
      </Typography>
    </StyledDiv>
  );
}

export default SummaryItem;
