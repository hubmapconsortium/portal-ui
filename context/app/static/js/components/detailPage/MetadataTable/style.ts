import { styled } from '@mui/material/styles';
import GetAppIcon from '@mui/icons-material/GetAppRounded';

import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';

const DownloadIcon = styled(GetAppIcon)({
  fontSize: 25,
});

const Flex = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
});

const StyledWhiteBackgroundIconButton = styled(WhiteBackgroundIconButton)(({ theme }) => ({
  marginBottom: theme.spacing(0.5),
}));

const StyledSectionHeader = styled(SectionHeader)({
  alignSelf: 'flex-end',
});

export { DownloadIcon, Flex, StyledWhiteBackgroundIconButton, StyledSectionHeader };
