/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import { Link, PanelWrapper, Name } from './style';

function Panel(props) {
  const { name, uuid, doi_id, dataset_uuids } = props;
  return (
    <Link href={`/browse/collection/${uuid}`}>
      <PanelWrapper>
        <div>
          <Name variant="subtitle1" component="h3">
            {name}
          </Name>
          <Typography variant="body2" color="secondary">
            {doi_id}
          </Typography>
        </div>
        <Typography variant="caption">{dataset_uuids.length} Datasets</Typography>
      </PanelWrapper>
    </Link>
  );
}

Panel.propTypes = {
  name: PropTypes.string.isRequired,
  uuid: PropTypes.string.isRequired,
  doi_id: PropTypes.string.isRequired,
  dataset_uuids: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Panel;
