import styled from 'styled-components';

import { ExternalLinkIcon } from 'js/shared-styles/icons';

const Flex = styled.div`
  padding: ${(props) => props.theme.spacing(2)};
  display: flex;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  &:hover {
    background-color: ${(props) => props.theme.palette.common.hoverShadow};
  }
`;

const StyledExternalIcon = styled(ExternalLinkIcon)`
  font-size: 1.2rem;
  vertical-align: middle;
`;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  flex-shrink: 0;
  margin-right: ${(props) => props.theme.spacing(2)};
`;

export { Flex, StyledExternalIcon, ImageWrapper };
