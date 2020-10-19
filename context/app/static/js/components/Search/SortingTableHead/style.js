import styled from 'styled-components';
import ArrowUpward from '@material-ui/icons/ArrowUpwardRounded';
import ArrowDownward from '@material-ui/icons/ArrowDownwardRounded';

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

export { ArrowUpOn, ArrowDownOn, ArrowUpOff, ArrowDownOff, StyledHeaderCell };
