import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

interface FlexProps {
  $active?: boolean;
}

const Flex = styled('div')<FlexProps>(({ theme, $active }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  cursor: 'pointer',
  p: {
    fontSize: theme.typography.subtitle2.fontSize,
    fontWeight: $active ? theme.typography.subtitle1.fontWeight : undefined,
  },
}));

const FormLabelText = styled(Typography)(({ theme }) => ({
  marginRight: theme.spacing(0.25),
}));

export { Flex, FormLabelText };
