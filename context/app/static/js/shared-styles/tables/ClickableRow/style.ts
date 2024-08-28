import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';

interface StyledRowProps {
  disabled?: boolean;
}

const StyledRow = styled(TableRow)<StyledRowProps>(({ theme, disabled }) => ({
  ...(disabled
    ? {
        '&:active': {
          pointerEvents: 'none',
        },
      }
    : {
        cursor: 'pointer',
        backgroundColor: theme.palette.white.main, // Necessary for hover effect.
        '&:hover': {
          filter: theme.palette.white.hover,
        },
      }),
}));

export { StyledRow };
