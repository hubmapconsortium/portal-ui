import React from 'react';
import PropTypes from 'prop-types';
import { SearchkitComponent, SearchBox, SelectedFilters, SortingSelector, ViewSwitcherToggle } from 'searchkit';

import SearchViewSwitch from '../SearchViewSwitch';
import TilesSortDropdown from '../TilesSortDropdown';
import { Flex, StyledDiv } from './style';

class Reset extends SearchkitComponent {
  render() {
    const type_filter = this.getQuery().index.selectedFilters.filter((obj) => obj.id === 'entity_type');
    const entity_type = type_filter[0]?.value;
    return <a href={`?entity_type[0]=${entity_type}`}>Reset</a>;
  }
}

function SearchBarLayout(props) {
  const { queryFields, sortOptions } = props;
  return (
    <>
      <Flex>
        <SearchBox autofocus queryFields={queryFields} />
        <StyledDiv>
          <SortingSelector options={sortOptions} listComponent={TilesSortDropdown} />
          <ViewSwitcherToggle listComponent={SearchViewSwitch} />
        </StyledDiv>
      </Flex>
      <SelectedFilters />
      <Reset />
    </>
  );
}

SearchBarLayout.propTypes = {
  queryFields: PropTypes.arrayOf(PropTypes.string).isRequired,
  sortOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default SearchBarLayout;
