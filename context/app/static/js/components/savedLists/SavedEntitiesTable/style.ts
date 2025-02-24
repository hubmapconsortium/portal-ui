import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';

const LeftMarginButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(1),
}));

const LeftMarginIconButton = styled(WhiteBackgroundIconButton)(({ theme }) => ({
  marginLeft: theme.spacing(1),
}));

export { LeftMarginButton, LeftMarginIconButton };
