import styled, { css } from 'styled-components';

const LetterboxedThumbnail = styled.img`
  ${({ $thumbnailDimension }) => css`
    width: ${$thumbnailDimension}px;
    height: ${$thumbnailDimension}px;
    min-width: ${$thumbnailDimension}px; // immediately takes up 90px when there is text overflow
  `}

  object-fit: contain;
  background-color: black;

  ${(props) =>
    !props.$shouldDisplayImage &&
    css`
      display: none;
    `}
`;

export { LetterboxedThumbnail };
