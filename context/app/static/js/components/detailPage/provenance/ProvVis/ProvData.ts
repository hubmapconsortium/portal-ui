import { provSchema } from './ProvSchema';
import type { CWLInput, CWLOutput, ProvData as ProvDataType, Step } from '../types';

function getCwlMeta(isReference: boolean) {
  return {
    global: true,
    in_path: true,
    type: isReference ? 'reference file' : 'data file',
  };
}

// export only to test.
export function makeCwlInput(name: string, steps: unknown[], extras: unknown, isReference = false): CWLInput {
  const id = name;
  const source: CWLInput['source'] = [
    {
      name,
      for_file: id,
      step: undefined,
    },
  ];
  if (steps) {
    if (steps.length > 1) {
      throw new Error('Limited to 1 step');
    } else if (steps.length === 1) {
      [source[0].step] = steps as unknown as string;
    }
  }
  return {
    name,
    source,
    run_data: {
      file: [{ '@id': id }],
    },
    meta: getCwlMeta(isReference),
    prov: extras || {}, // TODO: real-prov has unmatched ID: https://github.com/hubmapconsortium/prov-vis/issues/15
  };
}

// export only to test.
export function makeCwlOutput(name: string, steps: unknown[], extras: unknown, isReference = false): CWLOutput {
  const id = name;
  return {
    name,
    target: steps.map((step) => ({ step, name })),
    run_data: {
      file: [{ '@id': id }],
    },
    meta: getCwlMeta(isReference),
    // Domain-specific extras go here:
    prov: extras,
  };
}

interface ProvDataConstructorProps {
  prov: ProvDataType;
  entity_type: string;
  getNameForActivity?: (id: string, prov?: ProvDataType) => string;
  getNameForEntity?: (id: string, prov?: ProvDataType) => string;
}

export default class ProvData {
  getNameForEntity: (id: string, prov?: ProvDataType) => string;

  getNameForActivity: (id: string, prov?: ProvDataType) => string;

  entity_type: string;

  prov: ProvDataType;

  activityByName: Record<string, Record<string, string>>;

  entityByName: Record<string, Record<string, string>>;

  constructor({
    prov,
    entity_type,
    getNameForActivity = (id) => id,
    getNameForEntity = (id) => id,
  }: ProvDataConstructorProps) {
    this.getNameForActivity = getNameForActivity;
    this.getNameForEntity = getNameForEntity;
    this.entity_type = entity_type;

    const result = provSchema.safeParse(prov);
    if (!result.success) {
      const {
        error: { issues },
      } = result;

      const categorizedErrors = issues.reduce(
        (acc, { path, message: category }) => {
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(path);
          return acc;
        },
        {} as Record<string, (string | number)[][]>,
      );

      const formattedCategorizedErrors = Object.entries(categorizedErrors).reduce(
        (acc, [category, paths]) => `${acc}\n${category}: ${paths.map((path) => `'${path.join('.')}'`).join(', ')}`,
        'Received invalid provenance data. The following categories of errors were found:',
      );

      throw new Error(formattedCategorizedErrors);
    }

    this.prov = prov;

    this.activityByName = Object.fromEntries(
      Object.entries(this.prov.activity).map(([activityId, activity]) => [
        getNameForActivity(activityId, this.prov),
        activity,
      ]),
    );

    this.entityByName = Object.fromEntries(
      Object.entries(this.prov.entity).map(([entityId, entity]) => [getNameForEntity(entityId, this.prov), entity]),
    );
  }

  getEntityNames(activityName: string, relation: keyof ProvDataType) {
    return Object.values(this.prov[relation])
      .filter((pair) => this.getNameForActivity(pair['prov:activity'], this.prov) === activityName)
      .map((pair) => this.getNameForEntity(pair['prov:entity'], this.prov));
  }

  getParentEntityNames(activityName: string) {
    return this.getEntityNames(activityName, 'used');
  }

  getChildEntityNames(activityName: string) {
    return this.getEntityNames(activityName, 'wasGeneratedBy');
  }

  getActivityNames(entityName: string, relation: keyof ProvDataType) {
    if (!this.prov[relation]) {
      return [];
    }

    const provRelation = this.prov[relation];

    return Object.values(provRelation)
      .filter((pair) => this.getNameForEntity(pair['prov:entity'], this.prov) === entityName)
      .map((pair) => this.getNameForActivity(pair['prov:activity'], this.prov));
  }

  getParentActivityNames(entityName: string) {
    return this.getActivityNames(entityName, 'wasGeneratedBy');
  }

  getChildActivityNames(entityName: string) {
    return this.getActivityNames(entityName, 'used');
  }

  makeCwlStep(activityId: string): Step {
    const activityName = this.getNameForActivity(activityId, this.prov);
    const parents = this.getParentEntityNames(activityName);
    const inputs = parents.map((entityName) =>
      makeCwlInput(entityName, this.getParentActivityNames(entityName), this.entityByName[entityName]),
    );
    const outputs = this.getChildEntityNames(activityName).map((entityName) =>
      makeCwlOutput(entityName, this.getChildActivityNames(entityName), this.entityByName[entityName]),
    );
    return {
      name: activityName,
      inputs,
      outputs,
      prov: this.prov.activity[activityId],
    };
  }

  toCwl() {
    return Object.entries(this.prov.activity).reduce((acc, [activityId, activity]) => {
      if (
        // activity names currently vary across environments
        // TODO reduce to single value once apis are consistent
        !['Register Donor Activity', 'Create Donor Activity'].includes(activity['hubmap:creation_action']) ||
        // donors only have a single step which can't be removed
        // TODO determine how to remove actvitiy node for donors
        this.entity_type === 'Donor'
      ) {
        acc.push(this.makeCwlStep(activityId));
      }
      return acc;
    }, [] as Step[]);
  }
}
