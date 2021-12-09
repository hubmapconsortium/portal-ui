import styled, { css } from 'styled-components';

const StyledRect = styled.rect`
  ${(props) =>
    props.$showHover &&
    css`
      &:hover {
        filter: brightness(50%);
      }
    `}
`;

export { StyledRect };
