import { describe, it, expect } from 'vitest';
import { getHuBMAPIdDisplayInfo } from './CellContent';

describe('getHuBMAPIdDisplayInfo', () => {
  it('flags a retracted dataset with a next_revision_uuid as superseded and builds the replacement url', () => {
    const info = getHuBMAPIdDisplayInfo({
      next_revision_uuid: 'abc123',
      mapped_status: 'Retracted',
      entity_type: 'Dataset',
    } as never);

    expect(info.isSuperseded).toBe(true);
    expect(info.isRetracted).toBe(true);
    expect(info.latestRevisionUrl).toBe('/browse/dataset/abc123');
  });
});
