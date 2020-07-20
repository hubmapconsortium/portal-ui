/* eslint-disable no-underscore-dangle */
import Ajv from 'ajv';

import schema from './schema.json';

export const PROV_NS = 'http://www.w3.org/ns/prov#';

// export only to test.
export function _makeCwlInput(name, steps, extras, isReference) {
  const id = name;
  const source = [
    {
      name,
      for_file: id,
    },
  ];
  if (steps) {
    if (steps.length > 1) {
      throw new Error('Limited to 1 step');
    } else if (steps.length === 1) {
      [source[0].step] = steps;
    }
  }
  return {
    name,
    source,
    run_data: {
      file: [{ '@id': id }],
    },
    meta: {
      global: true,
      in_path: true,
      type: isReference ? 'reference file' : 'data file',
    },
    prov: extras || {}, // TODO: real-prov has unmatched ID: https://github.com/hubmapconsortium/prov-vis/issues/15
  };
}

// export only to test.
export function _makeCwlOutput(name, steps, extras) {
  const id = name;
  return {
    name,
    target: steps.map((step) => ({ step, name })),
    run_data: {
      file: [{ '@id': id }],
    },
    meta: {
      global: true,
      in_path: true,
    },
    // Domain-specific extras go here:
    prov: extras,
  };
}

export function _expand(needsExpansion, prefixMap, onlyExpandKeysNext, onlyExpandKeys) {
  // Walk the needsExpansion object, using prefixMap to expand the keys, and values, if needed.
  // For "action" and "entity" we don't want to expand keys in what is really
  // user metadata... but that is two levels down, so we have two booleans we set in turn,
  // to stop us from expanding too deeply.
  if (typeof needsExpansion !== 'object') {
    const [prefix, stem] = needsExpansion.split(':');
    if (stem) {
      return prefixMap[prefix] + stem;
    }
    return prefix;
  }
  return Object.fromEntries(
    Object.entries(needsExpansion).map(([key, value]) => {
      const [prefix, stem] = key.split(':');
      return [prefixMap[prefix] + stem, onlyExpandKeys ? value : _expand(value, prefixMap, false, onlyExpandKeysNext)];
    }),
  );
}

export default class ProvData {
  constructor(prov, getNameForActivity = (id) => id, getNameForEntity = (id) => id) {
    this.getNameForActivity = getNameForActivity;
    this.getNameForEntity = getNameForEntity;

    const validate = new Ajv().compile(schema);
    const valid = validate(prov);
    if (!valid) {
      const failureReason = JSON.stringify(validate.errors, null, 2);
      throw new Error(failureReason);
    }
    this.prov = prov;
    this.prov.prefix._ = '[anonymous]';

    this._expandPrefixes();
    this._moveAgents();
  }

  _expandPrefixes() {
    // Modifies this.prov, with NS prefixes expanded.
    const expandedProv = { prefix: {} };
    Object.keys(this.prov)
      .filter((k) => k !== 'prefix')
      .forEach((topLevel) => {
        const mayNeedExpansion = this.prov[topLevel];
        expandedProv[topLevel] = _expand(
          mayNeedExpansion,
          this.prov.prefix,
          topLevel === 'entity' || topLevel === 'activity',
        );
      });
    this.prov = expandedProv;
  }

  _moveAgents() {
    // Modifies this.prov, with the the agent data expanded and moved to the activity.
    if (this.prov.actedOnBehalfOf) {
      Object.values(this.prov.actedOnBehalfOf).forEach((obj) => {
        const activityId = obj[`${PROV_NS}activity`];
        const delegateId = obj[`${PROV_NS}delegate`];
        const responsibleId = obj[`${PROV_NS}responsible`];

        this.prov.activity[activityId][`${PROV_NS}delegate`] = this.prov.agent[delegateId];
        this.prov.activity[activityId][`${PROV_NS}responsible`] = this.prov.agent[responsibleId];
      });
      delete this.prov.actedOnBehalfOf;
      delete this.prov.agent;
    }
  }

  _getEntityNames(activityName, relation) {
    return Object.values(this.prov[relation])
      .filter((pair) => this.getNameForActivity(pair[`${PROV_NS}activity`], this.prov) === activityName)
      .map((pair) => this.getNameForEntity(pair[`${PROV_NS}entity`], this.prov));
  }

  _getParentEntityNames(activityName) {
    return this._getEntityNames(activityName, 'used');
  }

  _getChildEntityNames(activityName) {
    return this._getEntityNames(activityName, 'wasGeneratedBy');
  }

  _getActivityNames(entityName, relation) {
    return Object.values(this.prov[relation])
      .filter((pair) => this.getNameForEntity(pair[`${PROV_NS}entity`], this.prov) === entityName)
      .map((pair) => this.getNameForActivity(pair[`${PROV_NS}activity`], this.prov));
  }

  _getParentActivityNames(entityName) {
    return this._getActivityNames(entityName, 'wasGeneratedBy');
  }

  _getChildActivityNames(entityName) {
    return this._getActivityNames(entityName, 'used');
  }

  makeCwlStep(activityId) {
    const entityByName = Object.fromEntries(
      Object.entries(this.prov.entity).map(([entityId, entity]) => [
        this.getNameForEntity(entityId, this.prov),
        entity,
      ]),
    );

    const activityName = this.getNameForActivity(activityId, this.prov);
    const inputs = this._getParentEntityNames(activityName).map((entityName) =>
      _makeCwlInput(entityName, this._getParentActivityNames(entityName), entityByName[entityName]),
    );
    const outputs = this._getChildEntityNames(activityName).map((entityName) =>
      _makeCwlOutput(entityName, this._getChildActivityNames(entityName), entityByName[entityName]),
    );
    return {
      name: activityName,
      inputs,
      outputs,
      prov: this.prov.activity[activityId],
    };
  }

  toCwl() {
    return Object.keys(this.prov.activity).map((activityId) => this.makeCwlStep(activityId));
  }
}
