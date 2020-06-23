import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { Flex } from './style';

function WorkflowItem(props) {
  const { icon: Icon, text, link } = props;
  return (
    <Flex>
      <Icon color="primary" style={{ fontSize: '48px' }} />
      <Typography variant="body1">{text}</Typography>
      {link}
    </Flex>
  );
}

WorkflowItem.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  icon: PropTypes.object.isRequired,
  text: PropTypes.string.isRequired,
  link: PropTypes.element,
};

WorkflowItem.defaultProps = {
  link: null,
};

export default React.memo(WorkflowItem);
