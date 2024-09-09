import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import SectionPaper from 'js/shared-styles/sections/SectionPaper';
import Title from 'js/shared-styles/pages/PageTitle';

const PageTitleWrapper = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(2.5),
}));

const PageTitle = styled(Title)(({ theme }) => ({
  marginBottom: theme.spacing(1.25),
}));

const ChartPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  marginBottom: theme.spacing(3.75),
}));

const DescriptionPaper = styled(ChartPaper)(({ theme }) => ({
  marginBottom: theme.spacing(1.25),
}));

const ChartTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1.25),
}));

const StyledSectionPaper = styled(SectionPaper)({
  display: 'flex',
});

export { PageTitleWrapper, PageTitle, ChartPaper, ChartTitle, DescriptionPaper, StyledSectionPaper };
