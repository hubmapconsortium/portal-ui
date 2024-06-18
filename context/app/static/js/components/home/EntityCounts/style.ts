import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import SvgIcon from '@mui/material/SvgIcon';
import { OrganIcon } from 'js/shared-styles/icons/URLSvgIcon';

const Background = styled('div')({
  backgroundColor: '#cfd3e2',
});

const FlexContainer = styled(Container)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    display: 'flex',
    flexWrap: 'wrap',
  },
}));

const iconSize = '4.5rem';

const StyledSvgIcon = styled(SvgIcon)({
  fontSize: iconSize,
});

const StyledOrganIcon = styled(OrganIcon)({
  width: iconSize,
  height: iconSize,
});

export { Background, FlexContainer, StyledSvgIcon, StyledOrganIcon };
