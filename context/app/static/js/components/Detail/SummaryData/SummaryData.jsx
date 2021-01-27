import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import SaveEditEntityButton from 'js/components/Detail/SaveEditEntityButton';
import { useInView } from 'react-intersection-observer';
import 'intersection-observer';

import useEntityStore from 'js/stores/useEntityStore';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { FileIcon } from 'js/shared-styles/icons';
import { Flex, FlexRight, FlexEnd, JsonButton, StyledTypography } from './style';
import SummaryItem from '../SummaryItem';
import StatusIcon from '../StatusIcon';

const entityStoreSelector = (state) => state.setSummaryComponentObserver;

function SummaryData(props) {
  const { entity_type, uuid, status, mapped_data_access_level, display_doi, children } = props;

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
      <Flex>
        <div>
          <StyledTypography variant="h2">{display_doi}</StyledTypography>
          {children && <FlexEnd data-testid="summary-data-parent">{children}</FlexEnd>}
        </div>
        <FlexRight>
          {entity_type === 'Dataset' && (
            <FlexEnd>
              <SummaryItem statusIcon={<StatusIcon status={status} />}>{status}</SummaryItem>
              <SummaryItem>{`${mapped_data_access_level} Access`}</SummaryItem>
            </FlexEnd>
          )}
          <FlexEnd>
            <SecondaryBackgroundTooltip title="View JSON">
              <JsonButton href={`/browse/${entity_type.toLowerCase()}/${uuid}.json`} target="_blank" component="a">
                <FileIcon color="primary" />
              </JsonButton>
            </SecondaryBackgroundTooltip>
            <SaveEditEntityButton uuid={uuid} entity_type={entity_type} />
          </FlexEnd>
        </FlexRight>
      </Flex>
    </>
  );
}

SummaryData.propTypes = {
  entity_type: PropTypes.string.isRequired,
  uuid: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  mapped_data_access_level: PropTypes.string.isRequired,
  children: PropTypes.element,
};

SummaryData.defaultProps = {
  children: undefined,
};

export default SummaryData;
