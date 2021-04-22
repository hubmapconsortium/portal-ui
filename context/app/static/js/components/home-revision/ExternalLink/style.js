import styled from 'styled-components';

import { ExternalLinkIcon } from 'js/shared-styles/icons';

const Flex = styled.div`
  padding: ${(props) => props.theme.spacing(2)}px;
  display: flex;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  &:hover {
    background-color: ${(props) => props.theme.palette.hoverShadow.main};
  }
`;

const StyledExternalIcon = styled(ExternalLinkIcon)`
  font-size: 1.2rem;
  vertical-align: middle;
`;

export { Flex, StyledExternalIcon };
