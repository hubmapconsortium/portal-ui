import { Paper } from '@mui/material';
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
  padding: ${(props) => props.theme.spacing(2)};
  font-size: ${(props) => props.theme.typography.body1.fontSize}};
`;

export { VisualizationBackground, VisualizationErrorBoundaryBackground };
