import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

interface PaddedBoxProps {
  $pad?: boolean;
}

const PaddedBox = styled(Box)<PaddedBoxProps>(({ $pad }) => ({
  padding: $pad ? '30px 40px' : '0px',
}));

export { PaddedBox };
