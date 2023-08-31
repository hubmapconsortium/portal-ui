import styled, { css } from 'styled-components';
import TableRow from '@mui/material/TableRow';

const StyledRow = styled(TableRow)`
  background-color: ${(props) => props.theme.palette.white.main}; // Necessary for hover effect.
  ${(props) =>
    props.disabled
      ? css`
          &:active {
            pointer-events: none;
          }
        `
      : css`
          cursor: pointer;
          &:hover {
            background-color: ${props.theme.palette.white.hover};
          }
        `}
`;

export { StyledRow };
