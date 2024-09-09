import { styled } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

const iconSize = '1.25rem';

const FlexMenuItem = styled(MenuItem)(({ theme, selected }) => ({
  display: 'flex',
  cursor: selected ? 'default' : 'pointer',
  '&&': {
    backgroundColor: '#fff',
  },
  '&:hover, :focus': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const CheckIcon = styled(CheckRoundedIcon)(({ theme }) => ({
  fontSize: iconSize,
  marginRight: theme.spacing(1),
}));

interface StyledSpanProps {
  $isSelected?: boolean;
}

const StyledSpan = styled('span')<StyledSpanProps>(({ $isSelected, theme }) => ({
  paddingLeft: $isSelected ? `calc(${iconSize} + ${theme.spacing(1)})` : 0,
}));

export { FlexMenuItem, CheckIcon, StyledSpan };
