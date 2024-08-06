import SvgIcon from '@mui/material/SvgIcon';
import { styled } from '@mui/material/styles';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
// TODO: Would it be ok to create visualization/style.js and put this there,
// so all the buttons would use it?
// Individual buttons padding on the left and right seems fragile, if they get rearranged.
export const StyledSecondaryBackgroundTooltip = styled(SecondaryBackgroundTooltip)`
  margin: 0 ${(props) => props.theme.spacing(1)};
`;

export const StyledSvgIcon = styled(SvgIcon)({
  height: '20px',
  width: '20px',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: '.2rem',
}) as typeof SvgIcon;
