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

function SummaryItem(props) {
  const { children } = props;
  return (
    <>
      <Typography variant="h6" component="p">
        {children}
      </Typography>
      <VerticalDivider orientation="vertical" flexItem />
    </>
  );
}

export default SummaryItem;
