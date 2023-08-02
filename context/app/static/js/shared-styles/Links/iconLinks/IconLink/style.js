import styled, { css } from 'styled-components';
import OutboundLink from 'js/shared-styles/Links/OutboundLink';
import { InternalLink } from 'js/shared-styles/Links';

const flexStyle = css`
  display: inline-flex;
  align-items: center;
`;

const FlexOutboundLink = styled(OutboundLink)`
  ${flexStyle};
`;
const FlexInternalLink = styled(InternalLink)`
  ${flexStyle}
`;

const StyledSpan = styled.span`
  ${(props) => css`margin-${props.$iconMargin}: ${props.theme.spacing(0.5)}`};
`;

export { FlexOutboundLink, FlexInternalLink, StyledSpan };
