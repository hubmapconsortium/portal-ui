import React from 'react';
import { SortingSelector } from 'searchkit';
import { LightBlueLink } from 'js/shared-styles/Links';
import { getByPath } from './utils';
import { StyledTable, StyledTableBody, StyledTableRow, StyledTableCell } from './style';
import SortingTableHead from '../SortingTableHead';

function ResultsTableBody(props) {
  const { hits, resultFields, detailsUrlPrefix, idField, sortOptions } = props;
  /* eslint-disable no-underscore-dangle, react/no-danger, jsx-a11y/control-has-associated-label */
  return (
    <StyledTable>
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
                    __html: hit.highlight.everything.join(' ... '),
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

export default ResultsTableBody;
