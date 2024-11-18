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
import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import EmailIconLink from 'js/shared-styles/Links/iconLinks/EmailIconLink';
import { isValidEmail, validateAndFormatOrcidId } from 'js/helpers/functions';
import IconPanel from 'js/shared-styles/panels/IconPanel';

import { useNormalizedContacts, useNormalizedContributors } from './hooks';
import { ContributorAPIResponse, sortContributors, contributorIsContact, ContactAPIResponse } from './utils';

const contributorsIconPanelText =
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
  title?: string;
  contributors: ContributorAPIResponse[];
  contacts?: ContactAPIResponse[];
  iconTooltipText?: string;
  showIconPanel?: boolean;
}

function ContributorsTable({
  title = '',
  contributors = [],
  contacts = [],
  iconTooltipText,
  showIconPanel,
}: ContributorsTableProps) {
  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'affiliation', label: 'Affiliation' },
    { id: 'contact', label: 'Contact' },
  ];

  const normalizedContributors = useNormalizedContributors(contributors);
  const normalizedContacts = useNormalizedContacts(contacts);

  if (contributors.length === 0) {
    return null;
  }

  const sortedContributors = sortContributors(normalizedContributors, normalizedContacts);

  const contents = (
    <Stack spacing={1}>
      {showIconPanel && <IconPanel status="info">{contributorsIconPanelText}</IconPanel>}
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
                const validatedOrcidId = validateAndFormatOrcidId(orcid);
                return (
                  <TableRow key={orcid} data-testid="contributor-row">
                    <TableCell>{`${name}${isPrincipalInvestigator ? ' (PI)' : ''}`}</TableCell>
                    <TableCell>{affiliation}</TableCell>
                    <TableCell>
                      <ContactCell isContact={contributorIsContact(contributor, normalizedContacts)} email={email} />
                    </TableCell>
                    <TableCell>
                      {validatedOrcidId && (
                        <OutboundIconLink href={`https://orcid.org/${validatedOrcidId}`} variant="body2">
                          {validatedOrcidId}
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
  );

  if (title === '') {
    return contents;
  }

  return (
    <CollapsibleDetailPageSection
      id={title.toLowerCase()}
      title={title}
      iconTooltipText={iconTooltipText}
      data-testid={title.toLowerCase()}
    >
      {contents}
    </CollapsibleDetailPageSection>
  );
}

export default ContributorsTable;
