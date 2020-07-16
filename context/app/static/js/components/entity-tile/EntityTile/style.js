import styled, { css } from 'styled-components';
import Paper from '@material-ui/core/Paper';

const tileWidth = '300px';

const StyledPaper = styled(Paper)`
  margin-bottom: ${(props) => props.theme.spacing(1)}px;
  box-shadow: ${(props) => props.theme.shadows[1]};

  ${(props) =>
    props.$isCurrentEntity &&
    css`
      background-color: ${props.theme.palette.primary.main};
      color: #ffffff;

      svg {
        color: #ffffff;
      }
    `}
`;

const HoverOverlay = styled.div`
  &:hover {
    box-shadow: ${(props) => props.theme.shadows[8]};
    background-color: ${(props) => props.theme.palette.whiteHoverOverlay.main};
  }

  ${(props) =>
    props.$isCurrentEntity &&
    css`
      &:hover {
        background-color: ${props.theme.palette.primaryHoverOverlay.main};
      }
    `}
`;

export { tileWidth, StyledPaper, HoverOverlay };
