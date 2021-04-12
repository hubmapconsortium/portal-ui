import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';

const StyledTypography = styled(Typography)`
  margin-bottom: ${(props) => props.theme.spacing(2)}px;
`;

export { StyledTypography };
