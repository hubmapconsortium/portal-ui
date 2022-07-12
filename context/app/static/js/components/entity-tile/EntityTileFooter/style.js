import styled from 'styled-components';
import SvgIcon from '@material-ui/core/SvgIcon';

const FooterIcon = styled(SvgIcon)`
  font-size: 0.9rem;
  height: 18px;
  margin-right: ${(props) => props.theme.spacing(1)}px;
`;

export { FooterIcon };
