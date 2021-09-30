import styled from 'styled-components';
import InfoIcon from '@material-ui/icons/InfoRounded';
import OpenInNewRoundedIcon from '@material-ui/icons/OpenInNewRounded';
import { HeaderCell } from 'js/shared-styles/tables';

const HeaderIconCell = styled(HeaderCell)`
  font-size: ${(props) => props.theme.typography.subtitle2.fontSize};
  font-weight: ${(props) => props.theme.typography.subtitle2.fontWeight};
`;

const CenterAlignedFlexRow = styled.div`
  display: flex;
  align-items: center;
`;

const StyledInfoIcon = styled(InfoIcon)`
  margin-left: ${(props) => props.theme.spacing(0.5)}px;
  font-size: 1rem;
`;

const StyledOpenInNewRoundedIcon = styled(OpenInNewRoundedIcon)`
  font-size: 1.1rem;
  vertical-align: text-bottom;
`;

export { HeaderIconCell, CenterAlignedFlexRow, StyledInfoIcon, StyledOpenInNewRoundedIcon };
