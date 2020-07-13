import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

const VerticalDivider = styled(Divider)`
  margin-left: 5px;
  margin-right: 5px;
  height: 15px;
  background-color: #444a65;
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
