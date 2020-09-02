import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

const VerticalDivider = styled(Divider)`
  margin-left: ${(props) => props.theme.spacing(1)}px;
  margin-right: ${(props) => props.theme.spacing(1)}px;
  height: 15px;
  background-color: ${(props) => props.theme.palette.text.primary};
  align-self: center;
`;

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
      <VerticalDivider orientation="vertical" flexItem />
    </StyledDiv>
  );
}

export default SummaryItem;
