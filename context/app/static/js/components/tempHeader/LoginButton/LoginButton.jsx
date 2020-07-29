import React from 'react';
import PropTypes from 'prop-types';
import { WhiteButton } from './style';

function LoginButton(props) {
  const { isAuthenticated } = props;

  const link = isAuthenticated ? 'logout' : 'login';

  return (
    <WhiteButton component="a" href={`/${link}`}>
      {link}
    </WhiteButton>
  );
}

LoginButton.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

export default LoginButton;
