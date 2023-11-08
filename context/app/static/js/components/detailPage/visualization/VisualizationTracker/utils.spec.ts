import { VitessceInteraction } from './types';
import { stringifyVitessceInteraction, getLastInteraction, mouseButtonMap, handleKeyPress } from './utils';

const testInteractions: Record<string, VitessceInteraction> = {
  get empty() {
    return [] as VitessceInteraction;
  },
  get single() {
    return [['click', 'heatmap', 'cell']] as VitessceInteraction;
  },
  get multiple() {
    return [
      ['click', 'heatmap', 'cell'],
      ['hover', 'scatterplot', 'gene'],
      ['click', 'scatterplot', 'cell'],
      ['click', 'gene', 'BRCA1'],
    ] as VitessceInteraction;
  },
  get multipleWithSameTarget() {
    return [
      ['click', 'heatmap', 'cell'],
      ['hover', 'scatterplot', 'gene'],
      ['click', 'scatterplot', 'cell'],
      ['click', 'gene', 'BRCA1'],
      ['hover', 'scatterplot', 'gene'],
      ['click', 'scatterplot', 'cell'],
      ['click', 'gene', 'BRCA1'],
    ] as VitessceInteraction;
  },
};

describe('stringifyVitessceInteraction', () => {
  it('should stringify an empty interaction to an empty string', () => {
    const expected = '';
    expect(stringifyVitessceInteraction(testInteractions.empty)).toEqual(expected);
  });
  it('should stringify a single interaction', () => {
    const expected = 'click heatmap cell';
    expect(stringifyVitessceInteraction(testInteractions.single)).toEqual(expected);
  });
  it('should stringify a list of interactions', () => {
    const expected = 'click heatmap cell > hover scatterplot gene > click scatterplot cell > click gene BRCA1';
    expect(stringifyVitessceInteraction(testInteractions.multiple)).toEqual(expected);
  });
  it('should stringify a list of interactions with multiple events on the same target', () => {
    const expected =
      'click heatmap cell > hover scatterplot gene > click scatterplot cell > click gene BRCA1 > hover scatterplot gene > click scatterplot cell > click gene BRCA1';
    expect(stringifyVitessceInteraction(testInteractions.multipleWithSameTarget)).toEqual(expected);
  });
});

describe('getLastInteraction', () => {
  it('should return null for an empty interaction', () => {
    expect(getLastInteraction(testInteractions.empty)).toBeNull();
  });
  it('should return the last interaction for a single interaction', () => {
    expect(getLastInteraction(testInteractions.single)).toEqual(testInteractions.single[0]);
  });
  it('should return the last interaction for a list of interactions', () => {
    expect(getLastInteraction(testInteractions.multiple)).toEqual(
      testInteractions.multiple[testInteractions.multiple.length - 1],
    );
    expect(getLastInteraction(testInteractions.multipleWithSameTarget)).toEqual(
      testInteractions.multipleWithSameTarget[testInteractions.multipleWithSameTarget.length - 1],
    );
  });
});

describe('mouseButtonMap', () => {
  it('should return the correct mouse button name for known buttons', () => {
    expect(mouseButtonMap[0]).toEqual('Left');
    expect(mouseButtonMap[1]).toEqual('Middle');
    expect(mouseButtonMap[2]).toEqual('Right');
  });
  it('should return the correct mouse button name for unknown buttons', () => {
    expect(mouseButtonMap[3]).toEqual('Unknown (3)');
    expect(mouseButtonMap[4]).toEqual('Unknown (4)');
    expect(mouseButtonMap[5]).toEqual('Unknown (5)');
  });
});

describe('handleKeyPress', () => {
  it.each`
    key        | expected
    ${'Tab'}   | ${['TabFocus', 'heatmap']}
    ${'Space'} | ${['Click', 'heatmap', 'Space']}
    ${'Enter'} | ${['Click', 'heatmap', 'Enter']}
  `(
    "should return the correct interaction for key '$key'",
    ({ key, expected }: { key: string; expected: VitessceInteraction[number] }) => {
      expect(handleKeyPress(key, { current: testInteractions.empty }, 'heatmap')).toEqual(expected);
    },
  );
  it('should append to the last interaction if the user is typing', () => {
    const interactionRef = { current: testInteractions.single };
    const expected = [...testInteractions.single, ['Keypress', 'heatmap', 'A']];

    interactionRef.current.push(handleKeyPress('A', interactionRef, 'heatmap'));
    expect(interactionRef.current).toEqual(expected);
    const expected2 = [...testInteractions.single, ['Keypress', 'heatmap', 'AB']];
    interactionRef.current.push(handleKeyPress('B', interactionRef, 'heatmap'));
    expect(interactionRef.current).toEqual(expected2);
  });
});
