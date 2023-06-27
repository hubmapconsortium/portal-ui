import { Paper } from '@material-ui/core';
import styled from 'styled-components';

import { vitessceFixedHeight } from '../Visualization/style';

const height = `height: ${vitessceFixedHeight}px;`;

const VisualizationBackground = styled.div`
  ${height}
  display: flex;
  align-items: center;
  justify-content: center;
`;

const VisualizationErrorBoundaryBackground = styled(Paper)`
  ${height}
  white-space: pre-line;
  overflow-y: auto;
  padding: 16px;
  font-zie: 16px;
`;

export { VisualizationBackground, VisualizationErrorBoundaryBackground };
