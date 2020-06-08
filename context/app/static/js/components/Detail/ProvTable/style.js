import styled from 'styled-components';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';

const CenteredListSubheader = styled(ListSubheader)`
  text-align: center;
`;

const FlexContainer = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: space-around;
`;

const ListColumn = styled(List)`
  display: flex;
  flex-direction: column;
`;

export { CenteredListSubheader, FlexContainer, ListColumn };
