import styled from 'styled-components';
import { BackgroundIconButton } from 'js/shared-styles/buttons';

import { FileIcon } from 'js/shared-styles/icons';
import Typography from '@material-ui/core/Typography';

const Flex = styled.div`
  display: flex;
  margin-bottom: ${(props) => props.theme.spacing(0.5)}px;
`;

const FlexRight = styled.div`
  display: flex;
  margin-left: auto;
`;

const FlexEnd = styled.div`
  display: flex;
  align-items: flex-end;
`;

const JsonButton = styled(BackgroundIconButton)`
  margin-left: auto;
`;

const StyledFileIcon = styled(FileIcon)`
  font-size: 1.2rem;
`;

const StyledTypography = styled(Typography)`
  margin-bottom: ${(props) => props.theme.spacing(0.5)}px;
`;

export { Flex, FlexRight, FlexEnd, JsonButton, StyledFileIcon, StyledTypography };
