import React from 'react';
import SummaryTitle from '../../detailPage/summary/SummaryTitle';
import { useAppContext } from '../../Contexts';

const hubmapUserHeader = {
  text: 'HuBMAP Consortium Member',
  icon: 'VerifiedUser' as const,
};

const nonHubmapUserHeader = {
  text: 'External User',
  icon: undefined,
};

export function ProfileTitle() {
  const { isHubmapUser } = useAppContext();
  const { text, icon } = isHubmapUser ? hubmapUserHeader : nonHubmapUserHeader;
  return <SummaryTitle entityIcon={icon}>{text}</SummaryTitle>;
}
