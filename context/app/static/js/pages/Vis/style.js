import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const PageTitleWrapper = styled.div`
  margin-bottom: 20px;
`;

const PageTitle = styled(Typography)`
  margin-bottom: 10px;
`;

const ChartPaper = styled(Paper)`
  padding: 20px;
  margin-bottom: 30px;
`;

const ChartTitle = styled(Typography)`
  margin-bottom: 10px;
`;

const FlexContainer = styled.div`
  display: flex;
`;

const FlexChild = styled.div`
  flex-shrink: 1;
  flex-grow: 1;
  width: 100px;
`;

const FlexDescriptionWrapper = styled.div`
  flex-basis: 30%;
  padding: 0px 30px;
`;

const HorizontalChartDescription = styled(Typography)`
  margin-top: 20px;
`;

export {
  PageTitleWrapper,
  PageTitle,
  ChartPaper,
  ChartTitle,
  FlexContainer,
  FlexChild,
  FlexDescriptionWrapper,
  HorizontalChartDescription,
};
