import React from 'react';
import PropTypes from 'prop-types';
import { ViewSwitcherHits } from 'searchkit'; // eslint-disable-line import/no-duplicates

import { customHighlight } from 'js/components/searchPage/config';

import { useAppContext } from 'js/components/Contexts';
import ResultsTable from '../ResultsTable';
import ResultsTiles from '../ResultsTiles';
import ResultsCCF from '../ResultsCCF';

function Results({
  sortOptions,
  hitsPerPage,
  tableResultFields,
  detailsUrlPrefix,
  idField,
  resultFieldIds,
  type,
  analyticsCategory,
}) {
  // one of the sort components must stay mounted to preserve sort history between views.
  return (
    <ViewSwitcherHits
      hitsPerPage={hitsPerPage}
      hitComponents={[
        {
          key: 'table',
          title: 'Table',
          listComponent: (
            <ResultsTable
              tableLabel={type}
              selectable
              resultFields={tableResultFields}
              detailsUrlPrefix={detailsUrlPrefix}
              idField={idField}
              sortOptions={sortOptions}
              analyticsCategory={analyticsCategory}
            />
          ),
          defaultOption: true,
        },
        { key: 'tile', title: 'Tile', listComponent: <ResultsTiles type={type} /> },
        { key: 'ccf', title: 'CCF', listComponent: <ResultsCCF type={type} /> },
      ]}
      sourceFilter={resultFieldIds}
      customHighlight={customHighlight}
    />
  );
}

Results.propTypes = {
  sortOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  hitsPerPage: PropTypes.number.isRequired,
  tableResultFields: PropTypes.arrayOf(PropTypes.object).isRequired,
  detailsUrlPrefix: PropTypes.string.isRequired,
  idField: PropTypes.string.isRequired,
  resultFieldIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  type: PropTypes.string.isRequired,
};

export default Results;
