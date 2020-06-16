import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

export const FlexColumnRight = styled.div`
  display: flex;
  margin-left: auto;
  flex-direction: column;
  justify-content: start;
`;

export const StyledTypography = styled(Typography)`
  margin-bottom: ${(props) => (props.mb ? '5px' : '0px')};
`;

export const StyledDivider = styled(Divider)`
  margin-left: 10px;
  margin-right: 10px;
`;
