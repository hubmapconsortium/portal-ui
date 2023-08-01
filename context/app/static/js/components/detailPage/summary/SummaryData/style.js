import styled from 'styled-components';
import Typography from '@mui/material/Typography';
import SvgIcon from '@mui/material/SvgIcon';

import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';

const FlexEnd = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
`;

const JsonButton = styled(WhiteBackgroundIconButton)`
  height: 36px;
`;

const StyledTypography = styled(Typography)`
  margin-bottom: ${(props) => props.theme.spacing(0.5)};
`;

const StyledSvgIcon = styled(SvgIcon)`
  font-size: 1.25rem;
  margin-right: ${(props) => props.theme.spacing(0.5)}px;
`;

const SummaryDataHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing(1)}px;
`;

export { FlexEnd, JsonButton, StyledTypography, StyledSvgIcon, SummaryDataHeader };
