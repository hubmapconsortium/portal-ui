import styled from 'styled-components';
import Paper from '@mui/material/Paper';

// TODO: Copied and pasted the padding.
// Should find a way to manage it in one place.
const StyledPaper = styled(Paper)`
  margin-bottom: 16px;

  padding: 30px 40px 30px 40px;

  a {
    color: ${(props) => props.theme.palette.link.main};
  }

  img {
    max-width: 100%;
  }

  table {
    border-spacing: 0px;
    border-collapse: collapse;
    overflow: scroll;
    display: block; // overflow only applies to block elements.
  }
  th,
  td {
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

  // The header styles are copied from the Material UI defaults.
  // The style for h1 (one "#") was too large, so everything is bumped down a level.

  // h1 {
  //   font-size: 2.6rem;
  //   font-weight: 300;
  //   line-height: 1.167;
  // }

  h1 {
    font-size: 2.3rem;
    font-weight: 300;
    line-height: 1.2;
  }
  h2 {
    font-size: 2rem;
    font-weight: 300;
    line-height: 1.167;
  }
  h3 {
    font-size: 1.6rem;
    font-weight: 300;
    line-height: 1.235;
  }
  h4 {
    font-size: 1.3rem;
    font-weight: 300;
    line-height: 1.334;
  }
  h5 {
    font-size: 1rem;
    font-weight: 300;
    line-height: 1.6;
  }

  details {
    margin-left: 2em;
    summary {
      margin-left: -2em;
    }
  }
`;

export { StyledPaper };
