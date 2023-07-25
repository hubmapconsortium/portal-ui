import styled from 'styled-components';
import GetAppIcon from '@material-ui/icons/GetAppRounded';

import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';

const DownloadIcon = styled(GetAppIcon)`
  font-size: 25px;
`;

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledWhiteBackgroundIconButton = styled(WhiteBackgroundIconButton)`
  margin-bottom: ${(props) => props.theme.spacing(0.5)}px;
`;

export { DownloadIcon, Flex, StyledWhiteBackgroundIconButton };
