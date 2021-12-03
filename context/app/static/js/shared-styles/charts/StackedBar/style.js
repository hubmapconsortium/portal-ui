import styled, { css } from 'styled-components';

const StyledRect = styled.rect`
  ${(props) =>
    props.$isHovered &&
    css`
      filter: brightness(50%);
    `};
`;

export { StyledRect };
