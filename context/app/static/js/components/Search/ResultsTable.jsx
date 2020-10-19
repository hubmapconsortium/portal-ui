import React from 'react';
import PropTypes from 'prop-types';
import { ViewSwitcherHits } from 'searchkit'; // eslint-disable-line import/no-duplicates

import ResultsTableBody from './ResultsTableBody';
import ResultsTiles from './ResultsTiles';

function ResultsTable(props) {
  const { sortOptions, hitsPerPage, resultFields, detailsUrlPrefix, idField, resultFieldIds, type } = props;

  return (
    <ViewSwitcherHits
      hitsPerPage={hitsPerPage}
      hitComponents={[
        {
          key: 'table',
          title: 'Table',
          listComponent: (
            <ResultsTableBody
              resultFields={resultFields}
              detailsUrlPrefix={detailsUrlPrefix}
              idField={idField}
              sortOptions={sortOptions}
            />
          ),
          defaultOption: true,
        },
        { key: 'tile', title: 'Tile', listComponent: <ResultsTiles type={type} /> },
      ]}
      sourceFilter={resultFieldIds}
      customHighlight={{
        fields: { everything: { type: 'plain' } },
      }}
    />
  );
}

ResultsTable.propTypes = {
  sortOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  hitsPerPage: PropTypes.number.isRequired,
  resultFields: PropTypes.arrayOf(PropTypes.object).isRequired,
  detailsUrlPrefix: PropTypes.string.isRequired,
  idField: PropTypes.string.isRequired,
  resultFieldIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ResultsTable;
