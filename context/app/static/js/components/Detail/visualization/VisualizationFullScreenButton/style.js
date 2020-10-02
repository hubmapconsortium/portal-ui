import styled from 'styled-components';
import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';

const FullScreenButton = styled(WhiteBackgroundIconButton)`
  margin-left: ${(props) => props.theme.spacing(1)}px;
`;

export { FullScreenButton };
