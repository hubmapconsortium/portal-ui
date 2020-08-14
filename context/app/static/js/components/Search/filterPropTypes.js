import PropTypes from 'prop-types';

const refinementListPropTypes = PropTypes.exact({
  type: PropTypes.oneOf(['RefinementListFilter']).isRequired,
  props: PropTypes.exact({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    field: PropTypes.string.isRequired,
    operator: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
  }),
});

const rangeFilterPropTypes = PropTypes.exact({
  type: PropTypes.oneOf(['RangeFilter']).isRequired,
  props: PropTypes.exact({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    field: PropTypes.string.isRequired,
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    showHistogram: PropTypes.bool.isRequired,
  }),
});

const checkboxFilterPropTypes = PropTypes.exact({
  type: PropTypes.oneOf(['CheckboxFilter']).isRequired,
  props: PropTypes.exact({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    filter: PropTypes.object.isRequired,
  }),
});

export { refinementListPropTypes, rangeFilterPropTypes, checkboxFilterPropTypes };
