import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';

const FlexContainer = styled.div`
  display: flex;
`;

const FlexCenterAlign = styled(FlexContainer)`
  align-items: center;
`;

const FlexColumn = styled(FlexContainer)`
  flex-direction: column;
`;

const FlexRight = styled.div`
  display: flex;
  margin-left: auto;
`;

const FlexBottomRight = styled(FlexRight)`
  align-items: flex-end;
`;

const FlexColumnRight = styled(FlexRight)`
  flex-direction: column;
  justify-content: space-evenly;
`;

const StyledTypography = styled(Typography)`
  margin-left: ${(props) => (props.ml ? '10px' : '0px')};
  margin-top: ${(props) => (props.mt ? '5px' : '0px')};
`;

const JsonLink = styled(Link)`
  color: ${(props) => props.theme.palette.info.main};
`;

const StyledPaper = styled(Paper)`
  display: flex;
  min-height: 155px;
  padding: 30px 40px 30px 40px;
`;

export {
  FlexContainer,
  FlexCenterAlign,
  FlexColumn,
  FlexRight,
  FlexBottomRight,
  FlexColumnRight,
  StyledTypography,
  JsonLink,
  StyledPaper,
};
