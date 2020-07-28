import styled from 'styled-components';

const MarkdownStyle = styled.div`
  img {
    max-width: 100%;
  }

  table {
    border-spacing: 0px;
    border-collapse: collapse;
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
    list-style: circle;
    list-style-type: disc;
  }
`;

export { MarkdownStyle };
