import React from 'react';
import { ColoredStatusIcon } from './style';

function StatusIcon({ isUp }: { isUp: boolean }) {
  const color = isUp ? 'success' : 'error';
  const text = isUp ? 'Up' : 'Down';
  return (
    <>
      <ColoredStatusIcon $iconColor={color} />
      {text}
    </>
  );
}

export default StatusIcon;
