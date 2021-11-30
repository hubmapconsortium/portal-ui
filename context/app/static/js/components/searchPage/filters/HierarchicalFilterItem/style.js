import styled from 'styled-components';
import FilterLabelAndCount from 'js/components/searchPage/filters/FilterLabelAndCount';

const StyledFilterLabelAndCount = styled(FilterLabelAndCount)`
  p {
    color: ${(props) => (props.active ? props.theme.palette.text.primary : props.theme.palette.text.secondary)};
  }
`;

export { StyledFilterLabelAndCount };
