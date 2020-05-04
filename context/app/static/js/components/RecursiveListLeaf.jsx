/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import PanelTitle from './PanelTitle';

const StyledPaper = styled(Paper)`
  min-height: 48px;
  padding: 0px 24px;
  display: flex;
  align-items: center;
`;

function RecursiveListLeaf(props) {
  const { isRootChild } = props;
  return isRootChild ? (
    <StyledPaper>
      <PanelTitle {...props} />
    </StyledPaper>
  ) : (
    <PanelTitle {...props} />
  );
}

RecursiveListLeaf.propTypes = {
  isRootChild: PropTypes.bool,
};

RecursiveListLeaf.defaultProps = {
  isRootChild: false,
};

export default RecursiveListLeaf;
