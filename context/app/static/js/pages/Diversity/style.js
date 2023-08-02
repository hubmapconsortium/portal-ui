import styled from 'styled-components';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import SectionPaper from 'js/shared-styles/sections/SectionPaper';
import Title from 'js/shared-styles/pages/PageTitle';

const PageTitleWrapper = styled.div`
  margin-bottom: 20px;
`;

const PageTitle = styled(Title)`
  margin-bottom: 10px;
`;

const ChartPaper = styled(Paper)`
  padding: 20px;
  margin-bottom: 30px;
`;

const DescriptionPaper = styled(ChartPaper)`
  margin-bottom: 10px;
`;

const ChartTitle = styled(Typography)`
  margin-bottom: 10px;
`;

const StyledSectionPaper = styled(SectionPaper)`
  display: flex;
`;

export { PageTitleWrapper, PageTitle, ChartPaper, ChartTitle, DescriptionPaper, StyledSectionPaper };
