import React from 'react';
import PropTypes from 'prop-types';
import { SortingSelector } from 'searchkit';

import { LightBlueLink } from 'js/shared-styles/Links';
import { getByPath } from './utils';
import { StyledTable, StyledTableBody, StyledTableRow, StyledTableCell } from './style';
import SortingTableHead from '../SortingTableHead';

function ResultsTable(props) {
  const { hits, resultFields, detailsUrlPrefix, idField, sortOptions } = props;
  /* eslint-disable no-underscore-dangle, react/no-danger, jsx-a11y/control-has-associated-label */
  return (
    <StyledTable data-testid="search-results-table">
      <SortingSelector options={sortOptions} listComponent={SortingTableHead} />
      {hits.map((hit) => (
        <StyledTableBody key={hit._id}>
          <StyledTableRow className={'highlight' in hit && 'before-highlight'}>
            {resultFields.map((field) => (
              <StyledTableCell key={field.id}>
                {field.id === 'display_doi' ? (
                  <LightBlueLink href={detailsUrlPrefix + hit._source[idField]}>
                    {getByPath(hit._source, field)}
                  </LightBlueLink>
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
                    __html: hit.highlight.description.join(' ... '),
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
