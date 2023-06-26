import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';

const StyledTypography = styled(Typography)`
  margin: 0px ${(props) => props.theme.spacing(1)}px ${(props) => props.theme.spacing(1)}px 0px;
`;

export { StyledTypography };
