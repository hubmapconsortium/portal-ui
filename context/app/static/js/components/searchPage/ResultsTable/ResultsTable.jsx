import React from 'react';
import PropTypes from 'prop-types';
import { SortingSelector } from 'searchkit';

import { withAnalyticsCategory } from 'js/components/searchPage/hooks';
import { InternalLink } from 'js/shared-styles/Links';
import { getByPath } from './utils';
import { StyledTable, StyledTableBody, StyledTableRow, StyledTableCell } from './style';
import SortingTableHead from '../SortingTableHead';

function ResultsTable({ hits, resultFields, detailsUrlPrefix, idField, sortOptions, analyticsCategory }) {
  /* eslint-disable no-underscore-dangle, react/no-danger, jsx-a11y/control-has-associated-label */
  return (
    <StyledTable data-testid="search-results-table">
      <SortingSelector
        options={sortOptions}
        listComponent={withAnalyticsCategory(SortingTableHead, analyticsCategory)}
      />
      {hits.map((hit) => (
        <StyledTableBody key={hit._id}>
          <StyledTableRow className={'highlight' in hit && 'before-highlight'}>
            {resultFields.map((field) => (
              <StyledTableCell key={field.id}>
                {field.id === 'hubmap_id' ? (
                  <InternalLink href={detailsUrlPrefix + hit._source[idField]}>
                    {getByPath(hit._source, field)}
                  </InternalLink>
                ) : (
                  getByPath(hit._source, field)
                )}
              </StyledTableCell>
            ))}
          </StyledTableRow>
          {'highlight' in hit && (
            <StyledTableRow className="highlight">
              <StyledTableCell colSpan={resultFields.length}>
                <p
                  dangerouslySetInnerHTML={{
                    __html: Object.values(hit.highlight).join(' ... '),
                  }}
                />
              </StyledTableCell>
            </StyledTableRow>
          )}
        </StyledTableBody>
      ))}
    </StyledTable>
  );
  /* eslint-enable no-underscore-dangle, react/no-danger, jsx-a11y/control-has-associated-label */
}

ResultsTable.propTypes = {
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

ResultsTable.defaultProps = {
  hits: undefined,
};

export default ResultsTable;
