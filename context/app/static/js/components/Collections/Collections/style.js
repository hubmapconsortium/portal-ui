import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';

const PageWrapper = styled.div`
  @media (min-width: ${(props) => props.theme.breakpoints.values.md}px) {
    height: calc(100vh - 88px - 60px);
    display: flex;
    flex-direction: column;
  }
`;

const ScrollBox = styled(Paper)`
  @media (min-width: ${(props) => props.theme.breakpoints.values.md}px) {
    flex-grow: 1;
    overflow-y: scroll;
    margin-top: ${(props) => props.theme.spacing(1)}px 0px;
  }
`;

export { PageWrapper, ScrollBox };
