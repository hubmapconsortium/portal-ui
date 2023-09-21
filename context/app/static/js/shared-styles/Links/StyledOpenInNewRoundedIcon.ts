import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import styled from '@mui/material/styles/styled';

const StyledOpenInNewRoundedIcon = styled(OpenInNewRoundedIcon)(({ theme }) => ({
  fontSize: '1.1rem',
  verticalAlign: 'text-bottom',
  marginLeft: theme.spacing(1),
})) as typeof OpenInNewRoundedIcon;

export default StyledOpenInNewRoundedIcon;
