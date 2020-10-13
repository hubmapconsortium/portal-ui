import styled from 'styled-components';
import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';

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

const JsonButton = styled(WhiteBackgroundIconButton)`
  margin-left: auto;
`;

const StyledTypography = styled(Typography)`
  margin-bottom: ${(props) => props.theme.spacing(0.5)}px;
`;

export { Flex, FlexRight, FlexEnd, JsonButton, StyledTypography };
