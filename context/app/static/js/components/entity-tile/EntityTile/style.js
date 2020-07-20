import styled, { css } from 'styled-components';
import Paper from '@material-ui/core/Paper';

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
  width: 300px;

  &:hover {
    box-shadow: ${(props) => props.theme.shadows[8]};
    filter: ${(props) => props.theme.palette.white.hover};
  }

  ${(props) =>
    props.$invertColors &&
    css`
      &:hover {
        filter: ${props.theme.palette.primary.hover};
      }
    `}
`;

export { StyledPaper, invertSectionColors };
