import { styled } from '@mui/material/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/ArrowDownwardRounded';

const DownIcon = styled(KeyboardArrowDownIcon)(({ theme }) => ({
  fontSize: '2rem',
  marginBottom: theme.spacing(1),
}));

export { DownIcon };
