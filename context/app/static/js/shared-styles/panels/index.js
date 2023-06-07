import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

import { capitalizeString } from 'js/helpers/functions';
import { LightBlueLink } from 'js/shared-styles/Links';

const overflowCss = css`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const PanelWrapper = styled.div`
  padding: 15px 20px;
  border-bottom: 1px solid ${(props) => props.theme.palette.divider};
  display: flex;
  flex-direction: column;

  &:hover {
    background-color: ${(props) => props.theme.palette.hoverShadow.main};
  }
  @media (min-width: ${(props) => props.theme.breakpoints.values.md}) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const TextWrapper = styled.div`
  white-space: nowrap;
  min-width: 0px; // needed to handle overflow
  margin-right: ${(props) => props.theme.spacing(1)};
`;

const TruncatedText = styled(Typography)`
  ${overflowCss};
`;

const TruncatedLink = styled(LightBlueLink)`
  ${overflowCss};
  display: block; //text-overflow only applies to block elements
`;

const CountsWrapper = styled.div`
  flex-shrink: 0;
`;

const StyledTypography = styled(Typography)`
  margin-left: ${(props) => props.theme.spacing(0.5)};
`;

const PanelScrollBox = styled(Paper)`
  @media (min-width: ${(props) => props.theme.breakpoints.values.md}) {
    flex-grow: 1;
    overflow-y: scroll;
    margin-top: ${(props) => props.theme.spacing(1)};
  }
`;

function Panel({ title, href, secondaryText, entityCounts }) {
  return (
    <PanelWrapper>
      <TextWrapper>
        <TruncatedLink variant="subtitle1" href={href}>
          {title}
        </TruncatedLink>
        <TruncatedText variant="body2" color="secondary">
          {secondaryText}
        </TruncatedText>
      </TextWrapper>
      <CountsWrapper>
        {Object.entries(entityCounts).map(([key, value]) => (
          <StyledTypography key={key} variant="caption">{`${value} ${capitalizeString(key)}`}</StyledTypography>
        ))}
      </CountsWrapper>
    </PanelWrapper>
  );
}

Panel.propTypes = {
  title: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  secondaryText: PropTypes.string,
  entityCounts: PropTypes.shape({
    donors: PropTypes.number,
    samples: PropTypes.number,
    datasets: PropTypes.number,
  }),
};

Panel.defaultProps = {
  secondaryText: '',
  entityCounts: {},
};

export { Panel, PanelScrollBox, PanelWrapper };
