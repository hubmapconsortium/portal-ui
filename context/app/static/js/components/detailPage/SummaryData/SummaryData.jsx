import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import SaveEditEntityButton from 'js/components/detailPage/SaveEditEntityButton';
import { useInView } from 'react-intersection-observer';
import 'intersection-observer';

import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';
import useEntityStore from 'js/stores/useEntityStore';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { FileIcon } from 'js/shared-styles/icons';
import VersionSelect from 'js/components/detailPage/VersionSelect';
import { FlexEnd, JsonButton, StyledTypography } from './style';
import StatusIcon from '../StatusIcon';

const entityStoreSelector = (state) => state.setSummaryComponentObserver;

function SummaryData(props) {
  const {
    entity_type,
    uuid,
    status,
    mapped_data_access_level,
    hubmap_id,
    group_name,
    entityCanBeSaved,
    children,
  } = props;

  const setSummaryComponentObserver = useEntityStore(entityStoreSelector);

  const { ref, inView, entry } = useInView({
    /* Optional options */
    threshold: 0,
    initialInView: true,
  });

  useEffect(() => {
    if (entry) {
      setSummaryComponentObserver(inView, entry);
    }
  }, [setSummaryComponentObserver, entry, inView]);

  return (
    <>
      <Typography variant="subtitle1" component="h1" color="primary" ref={ref}>
        {entity_type}
      </Typography>
      <SpacedSectionButtonRow
        leftText={
          <div>
            <StyledTypography variant="h2">{hubmap_id}</StyledTypography>
            {children && <FlexEnd data-testid="summary-data-parent">{children}</FlexEnd>}
          </div>
        }
        buttons={
          <FlexEnd>
            {['Dataset', 'Support'].includes(entity_type) && (
              <Typography variant="h6" nowrap>
                <StatusIcon status={status} />
                {status}
                {' | '}
                {mapped_data_access_level} Access |
              </Typography>
            )}
            <FlexEnd>
              <SecondaryBackgroundTooltip title="View JSON">
                <JsonButton href={`/browse/${entity_type.toLowerCase()}/${uuid}.json`} target="_blank" component="a">
                  <FileIcon color="primary" />
                </JsonButton>
              </SecondaryBackgroundTooltip>
              {entityCanBeSaved && (
                <SaveEditEntityButton
                  uuid={uuid}
                  entity_type={entity_type}
                  group_name={group_name}
                  hubmap_id={hubmap_id}
                />
              )}
              {['Dataset', 'Support'].includes(entity_type) && <VersionSelect uuid={uuid} />}
            </FlexEnd>
          </FlexEnd>
        }
      />
    </>
  );
}

SummaryData.propTypes = {
  hubmap_id: PropTypes.string.isRequired,
  entity_type: PropTypes.string.isRequired,
  uuid: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  mapped_data_access_level: PropTypes.string.isRequired,
  entityCanBeSaved: PropTypes.bool,
};

SummaryData.defaultProps = {
  entityCanBeSaved: true,
};

export default SummaryData;
