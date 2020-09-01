import styled from 'styled-components';
import GetAppIcon from '@material-ui/icons/GetAppRounded';

import { BackgroundIconButton } from 'js/shared-styles/buttons';
import SectionHeader from '../SectionHeader';

const DownloadIcon = styled(GetAppIcon)`
  font-size: 25px;
`;

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledBackgroundIconButton = styled(BackgroundIconButton)`
  margin-bottom: ${(props) => props.theme.spacing(0.5)}px;
`;

const StyledSectionHeader = styled(SectionHeader)`
  align-self: flex-end;
`;

export { DownloadIcon, Flex, StyledBackgroundIconButton, StyledSectionHeader };
