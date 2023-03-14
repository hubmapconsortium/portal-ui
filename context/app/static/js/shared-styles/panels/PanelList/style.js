import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';

const PanelScrollBox = styled(Paper)`
  @media (min-width: ${(props) => props.theme.breakpoints.values.md}px) {
    flex-grow: 1;
    overflow-y: scroll;
  }
`;

export { PanelScrollBox };
