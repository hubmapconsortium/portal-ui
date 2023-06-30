import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { InfoIcon } from 'js/shared-styles/icons';

const StyledTypography = styled(Typography)`
  display: flex;
  align-items: center;
`;

const StyledInfoIcon = styled(InfoIcon)`
  margin-left: ${(props) => props.theme.spacing(0.5)}px;
`;

export { StyledTypography, StyledInfoIcon };
