import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

const DetailSectionPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
})) as typeof Paper;

export { DetailSectionPaper };
