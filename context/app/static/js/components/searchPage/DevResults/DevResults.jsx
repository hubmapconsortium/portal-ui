import React from 'react';
import PropTypes from 'prop-types';
import { ViewSwitcherHits } from 'searchkit';

import { customHighlight } from 'js/components/searchPage/config';

import ResultsTable from '../ResultsTable';
import ResultsCCF from '../ResultsCCF';

function DevResults({
  sortOptions,
  hitsPerPage,
  tableResultFields,
  detailsUrlPrefix,
  idField,
  resultFieldIds,
  analyticsCategory,
}) {
  return (
    <ViewSwitcherHits
      hitsPerPage={hitsPerPage}
      hitComponents={[
        {
          key: 'table',
          title: 'Table',
          listComponent: (
            <ResultsTable
              resultFields={tableResultFields}
              detailsUrlPrefix={detailsUrlPrefix}
              idField={idField}
              sortOptions={sortOptions}
              analyticsCategory={analyticsCategory}
            />
          ),
          defaultOption: true,
        },
        { key: 'ccf', title: 'CCF', listComponent: <ResultsCCF /> },
      ]}
      sourceFilter={resultFieldIds}
      customHighlight={customHighlight}
    />
  );
}

DevResults.propTypes = {
  sortOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  hitsPerPage: PropTypes.number.isRequired,
  tableResultFields: PropTypes.arrayOf(PropTypes.object).isRequired,
  detailsUrlPrefix: PropTypes.string.isRequired,
  idField: PropTypes.string.isRequired,
  resultFieldIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default DevResults;
