/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import { Link, PanelWrapper, Name } from './style';

function Panel(props) {
  const { name, uuid, display_doi, datasetsCount } = props;
  return (
    <Link href={`/browse/collection/${uuid}`}>
      <PanelWrapper>
        <div>
          <Name variant="subtitle1" component="h3">
            {name}
          </Name>
          <Typography variant="body2" color="secondary">
            {display_doi}
          </Typography>
        </div>
        <Typography variant="caption">{datasetsCount} Datasets</Typography>
      </PanelWrapper>
    </Link>
  );
}

Panel.propTypes = {
  name: PropTypes.string.isRequired,
  uuid: PropTypes.string.isRequired,
  display_doi: PropTypes.string.isRequired,
  datasetsCount: PropTypes.number.isRequired,
};

export default Panel;
