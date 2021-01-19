import React from 'react';
import PropTypes from 'prop-types';

function ResultsCCF(props) {
  // eslint-disable-next-line no-unused-vars
  const { hits, resultFields, detailsUrlPrefix, idField, sortOptions } = props;
  return <div>TODO</div>;
}

ResultsCCF.propTypes = {
  sortOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  resultFields: PropTypes.arrayOf(PropTypes.object).isRequired,
  detailsUrlPrefix: PropTypes.string.isRequired,
  idField: PropTypes.string.isRequired,
  hits: PropTypes.arrayOf(
    PropTypes.shape({
      sort: PropTypes.array,
      _id: PropTypes.string,
      _index: PropTypes.string,
      _score: PropTypes.number,
      _source: PropTypes.object,
      _type: PropTypes.string,
    }),
  ),
};

ResultsCCF.defaultProps = {
  hits: undefined,
};

export default ResultsCCF;
