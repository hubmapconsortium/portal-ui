import { Theme, styled } from '@mui/material/styles';
import { UpIcon, DownIcon } from 'js/shared-styles/icons';

const sharedIconStyles = ({ theme }: { theme: Theme }) => ({
  marginLeft: theme.spacing(0.5),
  fontSize: '1.5rem',
});

const StyledUpIcon = styled(UpIcon)(sharedIconStyles);
const StyledDownIcon = styled(DownIcon)(sharedIconStyles);

export { StyledUpIcon, StyledDownIcon };
