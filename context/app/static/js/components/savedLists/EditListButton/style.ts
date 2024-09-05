import { styled } from '@mui/material/styles';

import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';

const StyledEditButton = styled(WhiteBackgroundIconButton)(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

export { StyledEditButton };
