import styled, { css } from 'styled-components';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';
import RightAlignedButtonRow from 'js/shared-styles/sections/RightAlignedButtonRow';

const buttonSpacing = css`
  margin-left: ${(props) => props.theme.spacing(1)}px;
`;

const Flex = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
`;

const LeftMarginButton = styled(Button)`
  ${buttonSpacing}
`;

const LeftMarginIconButton = styled(WhiteBackgroundIconButton)`
  ${buttonSpacing}
`;

const StyledButtonRow = styled(RightAlignedButtonRow)`
  margin-bottom: ${(props) => props.theme.spacing(1)}px;
`;

const BottomAlignedTypography = styled(Typography)`
  align-self: flex-end;
`;

export { Flex, LeftMarginButton, LeftMarginIconButton, StyledButtonRow, BottomAlignedTypography };
