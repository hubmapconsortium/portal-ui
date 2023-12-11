import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export interface LineClampProps {
  lines: number;
}

export const LineClamp = styled(Box, { shouldForwardProp: (prop) => prop !== 'lines' })<LineClampProps>(
  ({ lines }) => ({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: lines,
    WebkitBoxOrient: 'vertical',
  }),
);

export default LineClamp;
