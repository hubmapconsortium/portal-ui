import styled, { css } from 'styled-components';
import Button from '@mui/material/Button';

import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';

const buttonSpacing = css`
  margin-left: ${(props) => props.theme.spacing(1)};
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
