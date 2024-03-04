/* eslint-disable consistent-return */
import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { SearchkitComponent, RenderComponentPropType, Panel } from 'searchkit';
import { styled } from '@mui/material/styles';

import CheckboxFilterItem from 'js/components/searchPage/filters/CheckboxFilterItem';
import { HierarchicalFacetAccessor } from './HierarchicalFacetAccessor';
import { CHILD_LEVEL, PARENT_LEVEL } from './LevelState';

const StyledSummary = styled(AccordionSummary)({
  margin: 0,
  padding: 0,
  '& > div': {
    padding: 0,
    margin: 0,
  },
});

function ParentAccordion({ parent, childBuckets, render }) {
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = useCallback(() => {
    setExpanded((prev) => !prev);
  }, [setExpanded]);

  return (
    <Accordion
      sx={{
        boxShadow: 'none',
        '&:before': {
          display: 'none',
        },
      }}
      disableGutters
      expanded={expanded}
      slotProps={{ transition: { unmountOnExit: true } }}
    >
      <StyledSummary
        expandIcon={
          <IconButton aria-label="delete" onClick={toggleExpanded} size="small" color="primary">
            <ExpandMoreIcon sx={{ fontSize: '1rem' }} color="inherit" />
          </IconButton>
        }
      >
        {render(PARENT_LEVEL, parent)}
      </StyledSummary>
      <AccordionDetails sx={{ ml: 1.5, p: 0 }}>
        {childBuckets.length > 0 &&
          childBuckets.map((bucket) => render(CHILD_LEVEL, { ...bucket, parentKey: parent.key }))}
      </AccordionDetails>
    </Accordion>
  );
}

export class HierarchicalMenuFilter extends SearchkitComponent {
  constructor(props) {
    super(props);

    this.renderOption = this.renderOption.bind(this);
    this.addFilter = this.addFilter.bind(this);
  }

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

  getIsIndeterminate({ level, active, option }) {
    if (level !== 0 || !active) {
      return false;
    }

    const childBuckets = this.accessor.getBuckets()[option.key].buckets;
    return !childBuckets.every((bucket) => this.accessor.state.contains(1, { ...bucket, parentKey: option.key }));
  }

  renderOption = (level, option) => {
    const { countFormatter } = this.props;

    const active = this.accessor.state.contains(level, option);

    return (
      <CheckboxFilterItem
        key={option.key}
        active={active}
        itemKey={option.key}
        showCount
        onClick={() => this.addFilter(option, level)}
        label={this.translate(option.key)}
        count={countFormatter(option.doc_count)}
        indeterminate={this.getIsIndeterminate({ level, active, option })}
      />
    );
  };

  renderBuckets() {
    const buckets = this.accessor.getBuckets();
    return (
      <div>
        {Object.values(buckets).map((parent) => (
          <ParentAccordion parent={parent} childBuckets={parent.buckets} render={this.renderOption} key={parent.key} />
        ))}
      </div>
    );
  }

  render() {
    if (!this.accessor) return null;
    const { id, title, containerComponent: ContainerComponent } = this.props;
    return (
      <ContainerComponent
        title={title}
        className={id ? `filter--${id}` : undefined}
        disabled={Object.keys(this.accessor.getBuckets(0)).length === 0}
      >
        {this.renderBuckets()}
      </ContainerComponent>
    );
  }
}
