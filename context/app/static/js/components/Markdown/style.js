import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';

// TODO: Copied and pasted the padding.
// Should find a way to manage it in one place.
const StyledPaper = styled(Paper)`
  margin-bottom: 16px;

  padding: 30px 40px 30px 40px;

  & img {
    max-width: 100%;
  }

  & table {
    border-spacing: 0px;
    border-collapse: collapse;
    overflow: scroll;
    display: block; // overflow only applies to block elements.
  }
  & th,
  & td {
    border: 1px solid grey;
    padding: 0.25em 0.5em;
  }

  blockquote {
    border-left: 4px solid grey;
    margin-left: 0;
    padding-left: 1em;
  }

  li {
    list-style: square;
  }
`;

export { StyledPaper };
