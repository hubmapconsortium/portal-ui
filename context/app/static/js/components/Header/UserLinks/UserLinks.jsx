import React from 'react';
import PropTypes from 'prop-types';

import { useAppContext } from 'js/components/Contexts';
import Dropdown from '../Dropdown';
import DropdownLink from '../DropdownLink';
import { StyledDivider } from '../HeaderContent/style';
import { TruncatedSpan, WarningDropdownLink } from './style';

function UserLinks({ isAuthenticated, userEmail }) {
  const { isWorkspacesUser } = useAppContext();

  return (
    <Dropdown
      title={<TruncatedSpan>{isAuthenticated ? userEmail || 'User' : 'User Profile'}</TruncatedSpan>}
      data-testid="user-profile-dropdown"
    >
      <DropdownLink href="/my-lists">My Lists</DropdownLink>
      {isWorkspacesUser && <DropdownLink href="/workspaces">My Workspaces</DropdownLink>}
      <StyledDivider />
      {isAuthenticated ? (
        <WarningDropdownLink href="/logout">Log Out</WarningDropdownLink>
      ) : (
        <DropdownLink href="/login" data-testid="login-link">
          Log In
        </DropdownLink>
      )}
    </Dropdown>
  );
}

UserLinks.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

export default UserLinks;
