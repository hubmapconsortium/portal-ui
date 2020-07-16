import styled, { css } from 'styled-components';
import Paper from '@material-ui/core/Paper';

const tileWidth = '300px';

const StyledPaper = styled(Paper)`
  margin-bottom: ${(props) => props.theme.spacing(1)}px;
  box-shadow: ${(props) => props.theme.shadows[1]};

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

export { tileWidth, StyledPaper };
