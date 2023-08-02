import styled from 'styled-components';
import GetAppIcon from '@mui/icons-material/GetAppRounded';

import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';

const DownloadIcon = styled(GetAppIcon)`
  font-size: 25px;
`;

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledWhiteBackgroundIconButton = styled(WhiteBackgroundIconButton)`
  margin-bottom: ${(props) => props.theme.spacing(0.5)};
`;

const StyledSectionHeader = styled(SectionHeader)`
  align-self: flex-end;
`;

export { DownloadIcon, Flex, StyledWhiteBackgroundIconButton, StyledSectionHeader };
