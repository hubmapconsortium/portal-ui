import styled, { css } from 'styled-components';
import Paper from '@material-ui/core/Paper';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

const tileWidth = '310px';

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
  margin-bottom: ${(props) => props.theme.spacing(1)}px;
  box-shadow: ${(props) => props.theme.shadows[1]};
  width: ${tileWidth};

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
  padding: ${(props) => props.theme.spacing(1)}px;
  box-sizing: content-box;
  min-width: 0;
`;

const StyledIcon = styled(SvgIcon)`
  font-size: 1.3rem;
  height: 25px;
  margin-right: ${(props) => props.theme.spacing(1)}px;
  color: ${(props) => (props.$invertColors ? props.theme.palette.white.main : props.theme.palette.primary.main)};
`;

const TruncatedTypography = styled(Typography)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export { StyledPaper, invertSectionColors, Flex, StyledIcon, TruncatedTypography, tileWidth };
