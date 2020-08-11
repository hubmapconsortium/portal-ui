import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import Paper from '@material-ui/core/Paper';

const StyledMarkdown = styled(ReactMarkdown)`
  li {
    list-style: circle;
    list-style-type: disc;
  }

  img {
    max-width: 100%;
  }
`;

const StyledPaper = styled(Paper)`
  display: flex;
  padding: 30px 40px 30px 40px;
`;

export { StyledMarkdown, StyledPaper };
