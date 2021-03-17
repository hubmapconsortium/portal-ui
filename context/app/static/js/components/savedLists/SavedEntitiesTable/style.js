import styled, { css } from 'styled-components';
import Button from '@material-ui/core/Button';

import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';

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

export { Flex, LeftMarginButton, LeftMarginIconButton };
