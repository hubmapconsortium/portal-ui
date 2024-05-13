import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

const PanelScrollBox = styled(Paper)(({ theme }) => {
  const media = `@media (min-width: ${theme.breakpoints.values.md}px)`;
  return {
    [media]: {
      flexGrow: 1,
      overflowY: 'scroll',
    },
  };
});

export { PanelScrollBox };
