import { styled } from '@mui/material/styles';
import CancelIcon from '@mui/icons-material/CancelRounded';

const StyledCancelIcon = styled(CancelIcon)(({ theme }) => ({
  fontSize: '1.2rem',
  margin: theme.spacing(0, 1),
  color: theme.palette.primary.main,
  cursor: 'pointer',
}));

const SelectedFilterDiv = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  border: `1px solid ${theme.palette.common.hoverShadow}`,
  borderRadius: theme.spacing(1),
  margin: theme.spacing(1, 1, 0, 0),
  display: 'flex',
  padding: theme.spacing(1, 0, 1, 1),
}));

export { StyledCancelIcon, SelectedFilterDiv };
