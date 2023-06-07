import styled from 'styled-components';
import Typography from '@mui/material/Typography';
import { SuccessIcon, ErrorIcon } from 'js/shared-styles/icons';

const StyledTypography = styled(Typography)`
  margin: 0px ${(props) => props.theme.spacing(1)} ${(props) => props.theme.spacing(1)} 0px;
`;

const Flex = styled.div`
  display: flex;
`;

const StyledErrorIcon = styled(ErrorIcon)`
  color: ${(props) => props.theme.palette.primary.main};
  margin-right: ${(props) => props.theme.spacing(1)};
  font-size: 1.5rem;
`;

const StyledSuccessIcon = styled(SuccessIcon)`
  color: ${(props) => props.theme.palette.success.main};
  margin-right: ${(props) => props.theme.spacing(1)};
  font-size: 1.5rem;
`;

export { StyledTypography, Flex, StyledSuccessIcon, StyledErrorIcon };
