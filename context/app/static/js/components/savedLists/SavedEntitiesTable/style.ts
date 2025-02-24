import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';
import NumSelectedHeader from 'js/shared-styles/tables/NumSelectedHeader';

const LeftMarginButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(1),
}));

const LeftMarginIconButton = styled(WhiteBackgroundIconButton)(({ theme }) => ({
  marginLeft: theme.spacing(1),
}));

const StyledNumSelectedHeader = styled(NumSelectedHeader)({
  borderTop: 'none',
  borderLeft: 'none',
  borderRight: 'none',
});

export { LeftMarginButton, LeftMarginIconButton, StyledNumSelectedHeader };
