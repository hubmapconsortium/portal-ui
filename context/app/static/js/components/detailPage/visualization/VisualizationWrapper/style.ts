import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

import { vitessceFixedHeight } from '../Visualization/style';

const VisualizationBackground = styled('div')({
  height: vitessceFixedHeight,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const VisualizationErrorBoundaryBackground = styled(Paper)(({ theme }) => ({
  height: vitessceFixedHeight,
  whiteSpace: 'pre-line',
  overflowY: 'auto',
  padding: theme.spacing(2),
  fontSize: theme.typography.body1.fontSize,
}));

export { VisualizationBackground, VisualizationErrorBoundaryBackground };
