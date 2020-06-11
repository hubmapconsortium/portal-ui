import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Flex } from './style';

function WorkflowItem(props) {
  const { Icon, text, Link } = props;
  return (
    <Flex>
      <Icon color="primary" style={{ fontSize: '48px' }} />
      <Typography variant="body1">{text}</Typography>
      {Link}
    </Flex>
  );
}

export default React.memo(WorkflowItem);
