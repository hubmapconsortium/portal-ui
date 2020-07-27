import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';

const StyledMarkdown = styled(ReactMarkdown)`
  li {
    list-style: circle;
    list-style-type: disc;
  }
`;

export { StyledMarkdown };
