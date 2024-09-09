import { styled } from '@mui/material/styles';
import ArrowUpward from '@mui/icons-material/ArrowUpwardRounded';
import ArrowDownward from '@mui/icons-material/ArrowDownwardRounded';

import { HeaderCell } from 'js/shared-styles/tables';

const sharedArrowStyles = {
  verticalAlign: 'text-top',
  fontSize: '1.1rem',
};

const ArrowUpOn = styled(ArrowUpward)(sharedArrowStyles);
const ArrowDownOn = styled(ArrowDownward)(sharedArrowStyles);

const ArrowUpOff = styled(ArrowUpward)({
  ...sharedArrowStyles,
  opacity: '12%',
});

const ArrowDownOff = styled(ArrowDownward)({
  ...sharedArrowStyles,
  opacity: '12%',
});

const StyledHeaderCell = styled(HeaderCell)({
  cursor: 'pointer',
  whiteSpace: 'nowrap',
});

export { ArrowUpOn, ArrowDownOn, ArrowUpOff, ArrowDownOff, StyledHeaderCell };
