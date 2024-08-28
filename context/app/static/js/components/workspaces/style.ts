import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Description from 'js/shared-styles/sections/Description';

import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';

const StyledButton = styled(WhiteBackgroundIconButton)(({ theme }) => ({
  height: theme.spacing(4.5),
}));

const LinkButton = styled('button')({
  all: 'unset',
  cursor: 'pointer',
});

const Bold = styled(Typography)({
  fontWeight: 'bold',
});

const StyledDescription = styled(Description)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2.5),
}));

export { StyledButton, LinkButton, Bold, StyledDescription };
