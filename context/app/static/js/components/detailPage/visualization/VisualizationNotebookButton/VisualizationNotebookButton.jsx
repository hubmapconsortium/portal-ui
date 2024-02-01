import React from 'react';
import GetAppRoundedIcon from '@mui/icons-material/GetAppRounded';
import styled from 'styled-components';
import postAndDownloadFile from 'js/helpers/postAndDownloadFile';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';

// TODO: Would it be ok to create visualization/style.js and put this there,
// so all the buttons would use it?
// Individual buttons padding on the left and right seems fragile, if they get rearranged.
const StyledSecondaryBackgroundTooltip = styled(SecondaryBackgroundTooltip)`
  margin: 0 ${(props) => props.theme.spacing(1)};
`;

const title = 'Download Jupyter Notebook';
function VisualizationNotebookButton({ uuid }) {
  const trackEntityPageEvent = useTrackEntityPageEvent();

  return (
    <StyledSecondaryBackgroundTooltip title={title}>
      <WhiteBackgroundIconButton
        onClick={() => {
          trackEntityPageEvent({ action: `Vitessce / ${title}` });
          postAndDownloadFile({
            url: `/notebooks/entities/dataset/${uuid}.ws.ipynb`,
            body: {},
          });
        }}
      >
        <GetAppRoundedIcon color="primary" />
      </WhiteBackgroundIconButton>
    </StyledSecondaryBackgroundTooltip>
  );
}

export default VisualizationNotebookButton;
