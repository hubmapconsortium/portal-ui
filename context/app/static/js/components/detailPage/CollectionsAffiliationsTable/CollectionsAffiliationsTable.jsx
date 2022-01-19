import React from 'react';
import PropTypes from 'prop-types';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { StyledTableContainer, HeaderCell } from 'js/shared-styles/tables';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { DetailPageSection } from 'js/components/detailPage/style';
import OutboundLink from 'js/shared-styles/Links/OutboundLink';
import { HeaderIconCell, StyledInfoIcon, CenterAlignedFlexRow, StyledOpenInNewRoundedIcon } from './style';

function CollectionsAffiliationsTable(props) {
  const { title, affiliations: tableRows } = props;

  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'affiliation', label: 'Affiliation' },
  ];

  return (
    <DetailPageSection id="datasets-table">
      <SectionHeader>{title}</SectionHeader>
      <Paper>
        <StyledTableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <HeaderCell key={column.id}>{column.label}</HeaderCell>
                ))}
                <HeaderIconCell>
                  <CenterAlignedFlexRow>
                    ORCID
                    <SecondaryBackgroundTooltip title="Open Researcher and Contributor ID">
                      <StyledInfoIcon color="primary" />
                    </SecondaryBackgroundTooltip>
                  </CenterAlignedFlexRow>
                </HeaderIconCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableRows.map((row) => (
                <TableRow key={row.orcid_id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.affiliation}</TableCell>
                  <TableCell>
                    <OutboundLink href={`https://orcid.org/${row.orcid_id}`} variant="body2">
                      {row.orcid_id} <StyledOpenInNewRoundedIcon />
                    </OutboundLink>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </Paper>
    </DetailPageSection>
  );
}

CollectionsAffiliationsTable.propTypes = {
  title: PropTypes.string.isRequired,
  affiliations: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CollectionsAffiliationsTable;
