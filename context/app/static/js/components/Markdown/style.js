import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';

const StyledPaper = styled(Paper)`
  & img {
    max-width: 100%;
  }

  & table {
    border-spacing: 0px;
    border-collapse: collapse;
  }
  & th,
  td {
    border: 1px solid grey;
  }

  padding: 30px 40px 30px 40px;
`;
// TODO: Copied and pasted the padding.
// Should find a way to manage it in one place.

export { StyledPaper };
