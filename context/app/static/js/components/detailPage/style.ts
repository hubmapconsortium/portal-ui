import { styled } from '@mui/material/styles';
import { Alert } from 'js/shared-styles/alerts';
import MUIAlert from '@mui/material/Alert';
import Section from 'js/shared-styles/sections/Section';

// Using the `typeof MUIAlert` workaround here to avoid converting
// all of the `Alert` components to TS for now.
const DetailPageAlert = styled(Alert as typeof MUIAlert)(({ theme }) => ({
  marginBottom: theme.spacing(2),
})) as typeof MUIAlert;

const OffsetSection = styled(Section)<{ $offset: number }>(({ $offset }) => ({
  scrollMarginTop: `${$offset}px`,
}));

export { DetailPageAlert, OffsetSection };
