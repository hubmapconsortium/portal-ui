/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import PanelTitle from './PanelTitle';

const StyledPaper = styled(Paper)`
  min-height: 48px;
  padding: 0px 24px;
  display: flex;
  align-items: center;
`;

export default function RecursiveListLeaf(props) {
  const { isRootChild } = props;
  return isRootChild ? (
    <StyledPaper>
      <PanelTitle {...props} />
    </StyledPaper>
  ) : (
    <PanelTitle {...props} />
  );
}
