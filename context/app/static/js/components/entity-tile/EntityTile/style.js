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
  width: 320px;

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
  padding: 8px;
  justify-content: space-between;
  min-height: 106px;
`;

const LetterboxedThumbnail = styled.img`
  width: 90px;
  height: 90px;
  min-width: 90px; // immediately takes up 90px when there is text overflow
  object-fit: contain;
  background-color: black;
`;

export { StyledPaper, invertSectionColors, Flex, LetterboxedThumbnail };
