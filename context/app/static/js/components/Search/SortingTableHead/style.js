import styled, { css } from 'styled-components';
import ArrowUpward from '@material-ui/icons/ArrowUpwardRounded';
import ArrowDownward from '@material-ui/icons/ArrowDownwardRounded';

import { HeaderCell } from 'js/shared-styles/tables';

const sharedArrowStyles = css`
  vertical-align: text-top;
  font-size: 1.1rem;
`;

const ArrowUpOn = styled(ArrowUpward)`
  ${sharedArrowStyles};
`;

const ArrowDownOn = styled(ArrowDownward)`
  ${sharedArrowStyles};
`;

const ArrowUpOff = styled(ArrowUpward)`
  ${sharedArrowStyles};

  opacity: 12%;
`;

const ArrowDownOff = styled(ArrowDownward)`
  ${sharedArrowStyles};

  opacity: 12%;
`;

const StyledHeaderCell = styled(HeaderCell)`
  cursor: pointer;
  white-space: nowrap;
`;

export { ArrowUpOn, ArrowDownOn, ArrowUpOff, ArrowDownOff, StyledHeaderCell };
