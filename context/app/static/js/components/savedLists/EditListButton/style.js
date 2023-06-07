import styled from 'styled-components';

import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';

const StyledEditButton = styled(WhiteBackgroundIconButton)`
  margin-right: ${(props) => props.theme.spacing(1)};
`;

export { StyledEditButton };
