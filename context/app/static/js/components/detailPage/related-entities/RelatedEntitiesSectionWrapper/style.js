import styled from 'styled-components';
import Paper from '@mui/material/Paper';

import CenteredLoaderWrapper from 'js/shared-styles/loaders/CenteredLoaderWrapper';

const sectionHeight = 335; // px

const StyledCenteredLoaderWrapper = styled(CenteredLoaderWrapper)`
  height: ${sectionHeight}px;
`;

const StyledPaper = styled(Paper)`
  height: ${sectionHeight}px;
  display: flex;
  flex-direction: column;
`;

export { StyledCenteredLoaderWrapper, StyledPaper };
