import { styled } from '@mui/material/styles';

const Flex = styled('div')({
  display: 'flex',
  width: '100%',
});

const CenteredDiv = styled('div')({
  display: 'flex',
  marginLeft: 'auto',
  alignItems: 'center',
});

export { Flex, CenteredDiv };
