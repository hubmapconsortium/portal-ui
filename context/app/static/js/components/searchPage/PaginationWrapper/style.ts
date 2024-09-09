import { styled } from '@mui/material/styles';

const Flex = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-end',
  marginTop: theme.spacing(3),
}));

export { Flex };
