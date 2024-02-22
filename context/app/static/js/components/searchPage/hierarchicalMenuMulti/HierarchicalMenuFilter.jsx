/* eslint-disable consistent-return */
import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import { SearchkitComponent, renderComponent, RenderComponentPropType, Panel } from 'searchkit';

import CheckboxFilterItem from 'js/components/searchPage/filters/CheckboxFilterItem';
import { HierarchicalFacetAccessor } from './HierarchicalFacetAccessor';

export class HierarchicalMenuFilter extends SearchkitComponent {
  static accessor;

  static defaultProps = {
    countFormatter: (n) => n,
    size: 20,
    containerComponent: Panel,
  };

  static propTypes = {
    ...SearchkitComponent.propTypes,
    id: PropTypes.string.isRequired,
    fields: PropTypes.arrayOf(PropTypes.string).isRequired,
    title: PropTypes.string.isRequired,
    orderKey: PropTypes.string,
    orderDirection: PropTypes.oneOf(['asc', 'desc']),
    countFormatter: PropTypes.func,
    containerComponent: RenderComponentPropType,
    itemComponent: RenderComponentPropType,
  };

  defineAccessor() {
    const { id, title, fields, size, orderKey, orderDirection } = this.props;
    return new HierarchicalFacetAccessor(id, {
      id,
      title,
      fields,
      size,
      orderKey,
      orderDirection,
    });
  }

  addFilter(option, level) {
    this.accessor.state = this.accessor.state.toggleLevel({ level, option });

    this.searchkit.performSearch();
  }

  getIsIndeterminate(level, active, option) {
    if (level !== 0 || !active) {
      return false;
    }

    const childBuckets = this.accessor.getBuckets(1).filter((bucket) => bucket.parentKey === option.key);

    return !childBuckets.every((bucket) => this.accessor.state.contains(1, bucket));
  }

  renderOption(level, option) {
    const { countFormatter } = this.props;
    const active = this.accessor.state.contains(level, option);
    return (
      <div key={option.key}>
        {renderComponent(CheckboxFilterItem, {
          active,
          itemKey: option.key,
          showCount: true,
          onClick: this.addFilter.bind(this, option, level),
          label: this.translate(option.key),
          count: countFormatter(option.doc_count),
          indeterminate: this.getIsIndeterminate(level, active, option),
        })}
        {(() => {
          if (this.accessor.resultsState.contains(level, option)) {
            return this.renderOptions(level + 1, option.key);
          }
        })()}
      </div>
    );
  }

  renderOptions(level, parentKey) {
    if (parentKey && !this.accessor.state.getValue()?.[parentKey]) {
      return null;
    }
    const buckets = this.accessor.getBuckets(level).filter((bucket) => bucket.parentKey === parentKey);
    return <Box sx={{ ml: level }}>{buckets.map((bucket) => this.renderOption.bind(this, level, bucket)())}</Box>;
  }

  render() {
    if (!this.accessor) return null;
    const { id, title, containerComponent } = this.props;
    return renderComponent(
      containerComponent,
      {
        title,
        className: id ? `filter--${id}` : undefined,
        disabled: this.accessor.getBuckets(0).length === 0,
      },
      <>{this.renderOptions(0)}</>,
    );
  }
}
