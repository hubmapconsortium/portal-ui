import styled from 'styled-components';
import ArrowUpward from '@material-ui/icons/ArrowUpwardRounded';
import ArrowDownward from '@material-ui/icons/ArrowDownwardRounded';
import Table from '@material-ui/core/Table';

import { HeaderCell } from 'js/shared-styles/Table';

const ArrowUpOn = styled(ArrowUpward)`
  vertical-align: middle;
`;

const ArrowDownOn = styled(ArrowDownward)`
  vertical-align: middle;
`;

const ArrowUpOff = styled(ArrowUpward)`
  vertical-align: middle;
  opacity: 12%;
`;

const ArrowDownOff = styled(ArrowDownward)`
  vertical-align: middle;
  opacity: 12%;
`;

const StyledHeaderCell = styled(HeaderCell)`
  cursor: pointer;
  white-space: nowrap;
`;

const StyledTable = styled(Table)`
  background-color: white;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12), 0 1px 3px 0 rgba(0, 0, 0, 0.2);
`;

export { ArrowUpOn, ArrowDownOn, ArrowUpOff, ArrowDownOff, StyledHeaderCell, StyledTable };
