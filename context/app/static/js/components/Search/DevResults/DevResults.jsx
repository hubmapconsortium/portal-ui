import React from 'react';
import PropTypes from 'prop-types';
import { Hits } from 'searchkit'; // eslint-disable-line import/no-duplicates

import ResultsTable from '../ResultsTable';

function DevResults(props) {
  const { sortOptions, hitsPerPage, resultFields, detailsUrlPrefix, idField, resultFieldIds } = props;

  return (
    <Hits
      hitsPerPage={hitsPerPage}
      listComponent={
        <ResultsTable
          resultFields={resultFields}
          detailsUrlPrefix={detailsUrlPrefix}
          idField={idField}
          sortOptions={sortOptions}
        />
      }
      sourceFilter={resultFieldIds}
      customHighlight={{
        fields: { everything: { type: 'plain' } },
      }}
    />
  );
}

DevResults.propTypes = {
  sortOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  hitsPerPage: PropTypes.number.isRequired,
  resultFields: PropTypes.arrayOf(PropTypes.object).isRequired,
  detailsUrlPrefix: PropTypes.string.isRequired,
  idField: PropTypes.string.isRequired,
  resultFieldIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default DevResults;
