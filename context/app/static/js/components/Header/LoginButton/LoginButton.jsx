import React from 'react';
import PropTypes from 'prop-types';

import Dropdown from '../Dropdown';
import DropdownLink from '../DropdownLink';
import { WhiteButton, TruncatedSpan } from './style';

function LoginButton(props) {
  const { isAuthenticated, userEmail } = props;

  const displayName = userEmail || 'User';

  return isAuthenticated ? (
    <Dropdown title={<TruncatedSpan>{displayName}</TruncatedSpan>}>
      <DropdownLink href="/logout">Log Out</DropdownLink>
    </Dropdown>
  ) : (
    <WhiteButton component="a" href="/login">
      Member Login
    </WhiteButton>
  );
}

LoginButton.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

export default LoginButton;
