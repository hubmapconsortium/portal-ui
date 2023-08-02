import styled from 'styled-components';
import SvgIcon from '@mui/material/SvgIcon';

const StyledIcon = styled(SvgIcon)`
  font-size: 1.3rem;
  height: 25px;
  margin-right: ${(props) => props.theme.spacing(1)};
`;

export { StyledIcon };
