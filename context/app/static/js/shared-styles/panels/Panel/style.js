import styled, { css } from 'styled-components';
import Typography from '@mui/material/Typography';

import { InternalLink } from 'js/shared-styles/Links';

const panelBorderStyles = css`
  border-bottom: 1px solid ${(props) => props.theme.palette.divider};
`;

const overflowCss = css`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const PanelBox = styled.div`
  ${panelBorderStyles}
  padding: 15px 20px;
  display: flex;
  flex-direction: column;

  &:hover {
    background-color: ${(props) => props.theme.palette.hoverShadow.main};
  }
  @media (min-width: ${(props) => props.theme.breakpoints.values.md}px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const LeftTextWrapper = styled.div`
  white-space: nowrap;
  min-width: 0px; // needed to handle overflow
  margin-right: ${(props) => props.theme.spacing(1)};
`;

const TruncatedText = styled(Typography)`
  ${overflowCss};
`;

const TruncatedLink = styled(InternalLink)`
  ${overflowCss};
  display: block; //text-overflow only applies to block elements
`;

const RightTextWrapper = styled.div`
  flex-shrink: 0;
  padding-left: ${(props) => props.theme.spacing(0.5)};
`;

export { PanelBox, LeftTextWrapper, TruncatedText, TruncatedLink, RightTextWrapper, panelBorderStyles };
