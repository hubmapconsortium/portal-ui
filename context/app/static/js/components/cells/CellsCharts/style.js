import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';

const PaddedDiv = styled.div`
  padding: ${(props) => props.theme.spacing(2)}px;
  width: 100%;
`;

const StyledTypography = styled(Typography)`
  margin: 0px 10px;
`;

const ChartWrapper = styled.div`
  height: 350px;
  width: 100%;
  margin-bottom: ${(props) => props.theme.spacing(1.5)}px;
`;

export { PaddedDiv, ChartWrapper, StyledTypography };
