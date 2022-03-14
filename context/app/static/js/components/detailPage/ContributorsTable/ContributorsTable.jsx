import React from 'react';
import PropTypes from 'prop-types';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import { StyledTableContainer, HeaderCell } from 'js/shared-styles/tables';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { DetailPageSection } from 'js/components/detailPage/style';
import { HeaderIconCell, StyledInfoIcon, CenterAlignedFlexRow } from './style';

function ContributorsTable(props) {
  const { title, contributors } = props;

  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'affiliation', label: 'Affiliation' },
  ];

  return (
    <DetailPageSection id="contributors">
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
              {contributors.map((row) => (
                <TableRow key={row.orcid_id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.affiliation}</TableCell>
                  <TableCell>
                    <OutboundIconLink href={`https://orcid.org/${row.orcid_id}`} variant="body2" iconFontSize="1rem">
                      {row.orcid_id}
                    </OutboundIconLink>
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

ContributorsTable.propTypes = {
  title: PropTypes.string.isRequired,
  contributors: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ContributorsTable;
