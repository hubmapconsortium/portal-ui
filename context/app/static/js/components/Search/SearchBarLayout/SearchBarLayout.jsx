/* eslint-disable max-classes-per-file */
import React from 'react';
import PropTypes from 'prop-types';
import { SearchkitComponent, SearchBox, SelectedFilters, SortingSelector, ViewSwitcherToggle } from 'searchkit';

import SearchViewSwitch from '../SearchViewSwitch';
import TilesSortDropdown from '../TilesSortDropdown';
import { Flex, StyledDiv, StyledCancelIcon } from './style';

class ResetLink extends SearchkitComponent {
  render() {
    const type_filter = this.getQuery().index.selectedFilters.filter((obj) => obj.id === 'entity_type');
    const entity_type = type_filter[0]?.value;
    return <a href={`?entity_type[0]=${entity_type}`}>Reset</a>;
  }
}

function SelectedFilter(props) {
  const { bemBlocks, labelKey, labelValue, removeFilter, filterId } = props;
  return (
    <div className={bemBlocks.option().mix(bemBlocks.container('item')).mix(`selected-filter--${filterId}`)}>
      <div className={bemBlocks.option('name')}>
        {labelKey}: {labelValue}
      </div>
      <StyledCancelIcon onClick={removeFilter} />
    </div>
  );
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
      <SelectedFilters itemComponent={SelectedFilter} />
      <ResetLink />
    </>
  );
}

SearchBarLayout.propTypes = {
  queryFields: PropTypes.arrayOf(PropTypes.string).isRequired,
  sortOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default SearchBarLayout;
