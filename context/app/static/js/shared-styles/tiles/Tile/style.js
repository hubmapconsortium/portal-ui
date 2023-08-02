import styled, { css } from 'styled-components';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

function invertSectionColors(backgroundColor, color, $invertColors) {
  return css`
    background-color: ${backgroundColor};
    svg {
      color: ${color};
    }

    ${() =>
      $invertColors &&
      css`
        background-color: ${color};
        color: ${backgroundColor};

        svg {
          color: ${backgroundColor};
        }
      `}
  `;
}

const StyledPaper = styled(Paper)`
  margin-bottom: ${(props) => props.theme.spacing(1)};
  box-shadow: ${(props) => props.theme.shadows[1]};
  width: ${(props) => props.$tileWidth}px;

  ${(props) =>
    invertSectionColors(props.theme.palette.white.main, props.theme.palette.primary.main, props.$invertColors)}

  &:hover {
    box-shadow: ${(props) => props.theme.shadows[8]};
    filter: brightness(96%);
  }

  ${(props) =>
    props.$invertColors &&
    css`
      &:hover {
        filter: brightness(108%);
      }
    `}
`;

const Flex = styled.div`
  display: flex;
  padding: ${(props) => props.theme.spacing(1)};
  box-sizing: content-box;
`;

const FlexGrow = styled.div`
  flex-grow: 1;
  min-width: 0;
`;

const TruncatedTypography = styled(Typography)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TileFooter = styled.div`
  display: flex;
  padding: 0 ${(props) => props.theme.spacing(1)};
  color: ${(props) => props.theme.palette.white.main};
  ${(props) =>
    invertSectionColors(props.theme.palette.primary.main, props.theme.palette.white.main, props.$invertColors)}
`;

const StyledDivider = styled(Divider)`
  background-color: ${(props) =>
    props.$invertColors ? props.theme.palette.primary.main : props.theme.palette.white.main};
  margin: 0px ${(props) => props.theme.spacing(0.5)};
`;

export { StyledPaper, invertSectionColors, Flex, FlexGrow, TruncatedTypography, TileFooter, StyledDivider };
