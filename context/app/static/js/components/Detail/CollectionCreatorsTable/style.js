import styled from 'styled-components';
import Link from '@material-ui/core/Link';
import InfoIcon from '@material-ui/icons/Info';
import { HeaderCell } from 'shared-styles/Table';

const HeaderIconCell = styled(HeaderCell)`
  font-size: ${(props) => props.theme.typography.subtitle2.fontSize};
  font-weight: ${(props) => props.theme.typography.subtitle2.fontWeight};
`;

const StyledLink = styled(Link)`
  color: ${(props) => props.theme.palette.info.main};
`;

const CenterAlignedFlexRow = styled.div`
  display: flex;
  align-items: center;
`;

const StyledInfoIcon = styled(InfoIcon)`
  margin-left: ${(props) => props.theme.spacing(0.5)}px;
  font-size: 1rem;
`;

export { HeaderIconCell, StyledLink, CenterAlignedFlexRow, StyledInfoIcon };
