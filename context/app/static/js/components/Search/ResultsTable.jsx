import React from 'react';
// import PropTypes from 'prop-types';

import Table from '@material-ui/core/Table';

import { SortingSelector, Hits } from 'searchkit'; // eslint-disable-line import/no-duplicates

import { StyledTableBody, StyledTableRow, StyledTableCell } from './style';

import SortingTableHead from './SortingTableHead';

function getByPath(nested, field) {
  const path = field.id;
  let current = nested;
  const pathEls = path.split('.');
  while (pathEls.length) {
    const nextEl = pathEls.shift();
    if (typeof current === 'object' && nextEl in current) {
      current = current[nextEl];
    } else {
      return null;
    }
  }
  if ('translations' in field) {
    return field.translations[current];
  }
  if (Array.isArray(current)) {
    return current.join(' / ');
  }
  return current;
}

function makeTableBodyComponent(resultFields, detailsUrlPrefix, idField) {
  return function ResultsTableBody(props) {
    const { hits } = props;
    /* eslint-disable no-underscore-dangle, react/no-danger, jsx-a11y/control-has-associated-label */
    return (
      <>
        {hits.map((hit) => (
          <StyledTableBody key={hit._id}>
            <StyledTableRow className={'highlight' in hit && 'before-highlight'}>
              {resultFields.map((field) => (
                <StyledTableCell key={field.id}>
                  <a href={detailsUrlPrefix + hit._source[idField]}>{getByPath(hit._source, field)}</a>
                </StyledTableCell>
              ))}
            </StyledTableRow>
            {'highlight' in hit && (
              <StyledTableRow className="highlight">
                <StyledTableCell colSpan={resultFields.length}>
                  <a
                    href={detailsUrlPrefix + hit._source[idField]}
                    dangerouslySetInnerHTML={{
                      __html: hit.highlight.everything.join(' ... '),
                    }}
                  />
                </StyledTableCell>
              </StyledTableRow>
            )}
          </StyledTableBody>
        ))}
      </>
    );
    /* eslint-enable no-underscore-dangle, react/no-danger, jsx-a11y/control-has-associated-label */
  };
}

function ResultsTable(props) {
  const { sortOptions, hitsPerPage, resultFields, detailsUrlPrefix, idField, resultFieldIds } = props;
  return (
    <Table>
      <SortingSelector options={sortOptions} listComponent={SortingTableHead} />
      <Hits
        hitsPerPage={hitsPerPage}
        listComponent={makeTableBodyComponent(resultFields, detailsUrlPrefix, idField)}
        sourceFilter={resultFieldIds}
        customHighlight={{
          fields: { everything: { type: 'plain' } },
        }}
      />
    </Table>
  );
}

export default ResultsTable;
export { getByPath }; // For tests
