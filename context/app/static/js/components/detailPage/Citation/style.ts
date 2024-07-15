import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { InfoIcon } from 'js/shared-styles/icons';

const FlexPaper = styled(Paper)({
  padding: '30px 40px',
});

const Flex = styled('div')(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(0.5),
}));

const FlexRight = styled('div')({
  display: 'flex',
  marginLeft: 'auto',
});

const StyledInfoIcon = styled(InfoIcon)(({ theme }) => ({
  marginLeft: theme.spacing(0.5),
}));

const StyledSectionHeader = styled(SectionHeader)({
  display: 'flex',
  alignItems: 'center',
});

export { FlexPaper, Flex, FlexRight, StyledInfoIcon, StyledSectionHeader };
