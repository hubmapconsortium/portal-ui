import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

const VerticalDivider = styled(Divider)`
  margin-left: ${(props) => props.theme.spacing(1)};
  height: 15px;
  background-color: ${(props) => props.theme.palette.text.primary};
  align-self: center;
`;

const StyledDiv = styled.div`
  display: flex;
  margin-right: ${(props) => props.theme.spacing(1)};
`;

function SummaryItem({ children, statusIcon, showDivider }) {
  return (
    <StyledDiv>
      {statusIcon}
      <Typography variant="h6" component="p">
        {children}
      </Typography>
      {showDivider && <VerticalDivider orientation="vertical" flexItem />}
    </StyledDiv>
  );
}

SummaryItem.propTypes = {
  statusIcon: PropTypes.element,
  showDivider: PropTypes.bool,
};

SummaryItem.defaultProps = {
  statusIcon: undefined,
  showDivider: true,
};

export default SummaryItem;
