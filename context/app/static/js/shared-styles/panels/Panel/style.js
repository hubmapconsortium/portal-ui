import styled, { css } from 'styled-components';
import Typography from '@material-ui/core/Typography';

import { LightBlueLink } from 'js/shared-styles/Links';

const overflowCss = css`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const PanelBox = styled.div`
  padding: 15px 20px;
  border-bottom: 1px solid ${(props) => props.theme.palette.divider};
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
  margin-right: ${(props) => props.theme.spacing(1)}px;
`;

const TruncatedText = styled(Typography)`
  ${overflowCss};
`;

const TruncatedLink = styled(LightBlueLink)`
  ${overflowCss};
  display: block; //text-overflow only applies to block elements
`;

const RightTextWrapper = styled.div`
  flex-shrink: 0;
  padding-left: ${(props) => props.theme.spacing(0.5)}px;
`;

export { PanelBox, LeftTextWrapper, TruncatedText, TruncatedLink, RightTextWrapper };
