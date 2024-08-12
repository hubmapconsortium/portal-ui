import React from 'react';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Check from '@mui/icons-material/Check';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import { StyledTableContainer, HeaderCell } from 'js/shared-styles/tables';
import IconTooltipCell from 'js/shared-styles/tables/IconTooltipCell';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import DetailPageSection from 'js/components/detailPage/DetailPageSection';
import EmailIconLink from 'js/shared-styles/Links/iconLinks/EmailIconLink';
import { OutlinedAlert } from 'js/shared-styles/alerts/OutlinedAlert.stories';
import { isValidEmail } from 'js/helpers/functions';

import { useNormalizedContacts, useNormalizedContributors } from './hooks';
import { ContributorAPIResponse, sortContributors, contributorIsContact, ContactAPIResponse } from './utils';

const contributorsInfoAlertText =
  'Below is the information for the individuals who provided this dataset. For questions for this dataset, reach out to the individuals listed as contacts, either via the email address listed in the table or contact information provided on their ORCID profile page.';

interface ContactCellProps {
  isContact: boolean;
  email: string;
}

function ContactCell({ isContact, email }: ContactCellProps) {
  if (!isContact) {
    return null;
  }

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Check color="success" fontSize="1.5rem" />
      {isValidEmail(email) ? (
        <EmailIconLink email={encodeURI(email)} iconFontSize="1.1rem">
          {email}
        </EmailIconLink>
      ) : (
        <Typography variant="body2">no email provided</Typography>
      )}
    </Stack>
  );
}

interface ContributorsTableProps {
  title: string;
  contributors: ContributorAPIResponse[];
  contacts?: ContactAPIResponse[];
  iconTooltipText?: string;
  showInfoAlert?: boolean;
}

function ContributorsTable({
  title,
  contributors = [],
  contacts = [],
  iconTooltipText,
  showInfoAlert,
}: ContributorsTableProps) {
  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'affiliation', label: 'Affiliation' },
    { id: 'contact', label: 'Contact' },
  ];

  const normalizedContributors = useNormalizedContributors(contributors);
  const normalizedContacts = useNormalizedContacts(contacts);

  const sortedContributors = sortContributors(normalizedContributors, normalizedContacts);

  return (
    <DetailPageSection id={title.toLowerCase()} data-testid={title.toLowerCase()}>
      <Stack spacing={1}>
        <SectionHeader iconTooltipText={iconTooltipText}>{title}</SectionHeader>
        {showInfoAlert && <OutlinedAlert severity="info">{contributorsInfoAlertText}</OutlinedAlert>}
        <Paper>
          <StyledTableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <HeaderCell
                      key={column.id}
                      data-testid={`${title.toLowerCase()}-${column.label.toLowerCase()}-header`}
                    >
                      {column.label}
                    </HeaderCell>
                  ))}
                  <IconTooltipCell
                    tooltipTitle="Open Researcher and Contributor ID"
                    data-testid={`${title.toLowerCase()}-orcid-header`}
                  >
                    ORCID
                  </IconTooltipCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedContributors.map((contributor) => {
                  const { affiliation, name, email, isPrincipalInvestigator, orcid } = contributor;
                  return (
                    <TableRow key={orcid} data-testid="contributor-row">
                      <TableCell>{`${name}${isPrincipalInvestigator ? ' (PI)' : ''}`}</TableCell>
                      <TableCell>{affiliation}</TableCell>
                      <TableCell>
                        <ContactCell isContact={contributorIsContact(contributor, normalizedContacts)} email={email} />
                      </TableCell>
                      <TableCell>
                        {orcid && (
                          <OutboundIconLink href={`https://orcid.org/${orcid}`} variant="body2">
                            {orcid}
                          </OutboundIconLink>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </StyledTableContainer>
        </Paper>
      </Stack>
    </DetailPageSection>
  );
}

export default ContributorsTable;
