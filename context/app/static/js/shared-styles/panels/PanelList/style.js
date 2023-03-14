import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';

const PanelScrollBox = styled(Paper)`
  @media (min-width: ${(props) => props.theme.breakpoints.values.md}px) {
    flex-grow: 1;
    overflow-y: scroll;
    margin-top: ${(props) => props.theme.spacing(1)}px;
  }
`;

export { PanelScrollBox };
