import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';

const StyledTypography = styled(Typography)`
  margin-bottom: ${(props) => props.theme.spacing(1)}px;
`;

const CenteredDiv = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${(props) => props.theme.spacing(2)}px;
`;

const MarginTopDiv = styled.div`
  margin-top: ${(props) => props.theme.spacing(2)}px;
`;

export { CenteredDiv, MarginTopDiv, StyledTypography };
