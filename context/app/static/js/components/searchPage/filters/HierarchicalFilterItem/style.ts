import { styled } from '@mui/material/styles';
import FilterLabelAndCount from 'js/components/searchPage/filters/FilterLabelAndCount';

const StyledFilterLabelAndCount = styled(FilterLabelAndCount)(({ theme, active }) => ({
  p: {
    color: active ? theme.palette.text.primary : theme.palette.text.secondary,
  },
}));

export { StyledFilterLabelAndCount };
