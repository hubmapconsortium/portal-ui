import styled from 'styled-components';
import TableHead from '@material-ui/core/TableHead';

const StyledTableHead = styled(TableHead)`
  ${({ searchView }) =>
    searchView === 'tile' &&
    `
    display: none;
  `}
`;

export { StyledTableHead };
