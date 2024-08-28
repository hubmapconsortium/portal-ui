import { styled } from '@mui/material/styles';

import HeaderIcon from 'js/shared-styles/icons/HeaderIcon';

const FlexContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

const StyledHeaderIcon = styled(HeaderIcon)(({ theme }) => ({
  marginRight: theme.spacing(1.5),
}));

export { FlexContainer, StyledHeaderIcon };
