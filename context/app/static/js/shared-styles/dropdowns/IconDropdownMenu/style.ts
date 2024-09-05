import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
// TODO: Would it be ok to create visualization/style.js and put this there,
// so all the buttons would use it?
// Individual buttons padding on the left and right seems fragile, if they get rearranged.
// export const StyledSecondaryBackgroundTooltip = styled(SecondaryBackgroundTooltip)`
//   marginLeft: theme.spacing${(props) => props.theme.spacing(1)};
// `;
export const StyledSecondaryBackgroundTooltip = styled(SecondaryBackgroundTooltip)(({ theme }) => ({
  marginLeft: theme.spacing(1),
}));

export const StyledSvgIcon = styled(SvgIcon)(({ theme }) => ({
  height: '1.25rem',
  width: '1.25rem',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: theme.spacing(0.2),
}));

export const StyledTypography = styled(Typography)({
  flexGrow: 1,
});
