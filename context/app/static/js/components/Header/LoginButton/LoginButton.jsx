import React from 'react';
import PropTypes from 'prop-types';

import Dropdown from '../Dropdown';
import DropdownLink from '../DropdownLink';
import { WhiteButton, TruncatedSpan } from './style';

function LoginButton(props) {
  const { isAuthenticated, user_email } = props;

  return isAuthenticated ? (
    <Dropdown
      title={<TruncatedSpan>{user_email}</TruncatedSpan>}
      menuListId="user-options"
      removeDefaultTextTransformations
      trimText
    >
      <DropdownLink href="/logout">Log Out</DropdownLink>
    </Dropdown>
  ) : (
    <WhiteButton component="a" href="/login">
      login
    </WhiteButton>
  );
}

LoginButton.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

export default LoginButton;
