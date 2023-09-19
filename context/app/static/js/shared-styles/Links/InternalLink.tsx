import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';

const InternalLink = styled(Link)(({ theme }) => ({
  color: theme.palette.common.link,
})) as typeof Link;

export default InternalLink;
