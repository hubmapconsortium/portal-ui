import { styled } from '@mui/material/styles';
import SvgIcon, { SvgIconTypeMap } from '@mui/material/SvgIcon';
import { OverridableComponent } from '@mui/material/OverridableComponent';

const HeaderIcon = styled(SvgIcon)(() => ({
  verticalAlign: '-12%',
  fontSize: '2.4rem',
})) as OverridableComponent<SvgIconTypeMap>;

export default HeaderIcon;
