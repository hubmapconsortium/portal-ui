import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1, 0, 1, 1),
  width: 130,
}));

const OverflowEllipsis = styled('div')({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  minWidth: 0,
  whiteSpace: 'nowrap',
});

const EmptyFullWidthDiv = styled('div')({
  width: '100%',
});

export { StyledButton, OverflowEllipsis, EmptyFullWidthDiv };
