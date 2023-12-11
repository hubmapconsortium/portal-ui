import { styled } from '@mui/material/styles';
import { Alert } from 'js/shared-styles/alerts';
import MUIAlert from '@mui/material/Alert';
import { entityHeaderHeight } from 'js/components/detailPage/entityHeader/EntityHeader';
import Section, { baseOffset } from 'js/shared-styles/sections/Section';

// Using the `typeof MUIAlert` workaround here to avoid converting
// all of the `Alert` components to TS for now.
const DetailPageAlert = styled(Alert as typeof MUIAlert)(({ theme }) => ({
  mb: theme.spacing(2),
})) as typeof MUIAlert;

const DetailPageSection = styled(Section)({
  scrollMarginTop: `${baseOffset + entityHeaderHeight}px`,
});

export { DetailPageAlert, DetailPageSection };
