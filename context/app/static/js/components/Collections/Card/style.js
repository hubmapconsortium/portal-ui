import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const StyledPaper = styled(Paper)`
  padding: 30px 40px 30px 40px;
  margin-bottom: 10px;
`;

const InlineDataKey = styled.span`
  font-weight: 600;
`;

const DataKey = styled(Typography)`
  font-weight: 600;
`;

const StyledDiv = styled.div`
  margin-bottom: 10px;
`;

const StyledTypography = styled(Typography)`
  margin-left: ${(props) => (props.ml ? '10px' : '0px')};
`;

export { StyledPaper, DataKey, InlineDataKey, StyledDiv, StyledTypography };
