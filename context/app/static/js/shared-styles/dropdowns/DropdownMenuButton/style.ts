import { styled } from '@mui/material/styles';
import { UpIcon, DownIcon } from 'js/shared-styles/icons';

const StyledUpIcon = styled(UpIcon)(({ theme }) => ({
  marginLeft: theme.spacing(0.5),
}));

const StyledDownIcon = styled(DownIcon)(({ theme }) => ({
  marginLeft: theme.spacing(0.5),
}));

export { StyledUpIcon, StyledDownIcon };
