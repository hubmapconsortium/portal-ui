import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  position: 'absolute',
  bottom: 0,
  right: 0,
  maxWidth: '100%',
}));

const maxGraphHeight = 500;
const StyledDiv = styled('div')({
  height: maxGraphHeight,
  width: '100%',
  '& .react-flow': {
    background: 'transparent',
  },
  position: 'relative',
});

export { StyledPaper, StyledDiv, maxGraphHeight };
