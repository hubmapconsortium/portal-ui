import React from 'react';
import PropTypes from 'prop-types';

import { useAppContext } from 'js/components/Contexts';
import { getUserType } from 'js/helpers/trackers';
import Dropdown from '../Dropdown';
import DropdownLink from '../DropdownLink';
import { StyledDivider } from '../HeaderContent/style';
import { TruncatedSpan, WarningDropdownLink } from './style';

function UserLinks({ isAuthenticated, userEmail }) {
  const { isWorkspacesUser } = useAppContext();

  const userType = getUserType();

  const isOnboardableToWorkspaces = isWorkspacesUser || userType === 'internal';
  return (
    <Dropdown
      title={<TruncatedSpan>{isAuthenticated ? userEmail || 'User' : 'User Profile'}</TruncatedSpan>}
      data-testid="user-profile-dropdown"
    >
      {isAuthenticated && <DropdownLink href="/profile">My Profile</DropdownLink>}
      <DropdownLink href="/my-lists">My Lists</DropdownLink>
      {isOnboardableToWorkspaces && <DropdownLink href="/workspaces">My Workspaces</DropdownLink>}
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
