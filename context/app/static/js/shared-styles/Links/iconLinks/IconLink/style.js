import styled, { css } from 'styled-components';
import OutboundLink from 'js/shared-styles/Links/OutboundLink';
import { LightBlueLink } from 'js/shared-styles/Links';

const flexStyle = css`
  display: inline-flex;
  align-items: center;
`;

const FlexOutboundLink = styled(OutboundLink)`
  ${flexStyle};
`;
const FlexLightBlueLink = styled(LightBlueLink)`
  ${flexStyle}
`;

const StyledSpan = styled.span`
  ${(props) =>
    props.$iconPosition === 'start'
      ? css`
          margin-left: ${props.theme.spacing(0.5)}px;
        `
      : css`
          margin-right: ${props.theme.spacing(0.5)}px;
        `};
`;

export { FlexOutboundLink, FlexLightBlueLink, StyledSpan };
