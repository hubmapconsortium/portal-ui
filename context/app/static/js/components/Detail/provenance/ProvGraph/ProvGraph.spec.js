import React from 'react';

// eslint-disable-next-line import/no-unresolved
import { render, screen } from 'test-utils/functions';
import ProvGraph from './ProvGraph';

const provData = {
  prefix: { hubmap: 'https://hubmapconsortium.org/' },
  agent: {
    'hubmap:agent/30267a6e-35fe-40ef-8792-f311321868e9': {
      'prov:type': { $: 'prov:Person', type: 'prov:QUALIFIED_NAME' },
      'hubmap:userDisplayName': 'Elizabeth Neumann',
      'hubmap:userEmail': 'neumane@vanderbilt.edu',
      'hubmap:userUUID': '30267a6e-35fe-40ef-8792-f311321868e9',
    },
    'hubmap:organization/73bb26e4-ed43-11e8-8f19-0a7c1eab007a': {
      'prov:type': { $: 'prov:Organization', type: 'prov:QUALIFIED_NAME' },
      'hubmap:groupUUID': '73bb26e4-ed43-11e8-8f19-0a7c1eab007a',
      'hubmap:groupName': 'Vanderbilt TMC',
    },
  },
  activity: {
    'hubmap:activities/b2d1ee0970654ba5a158b25526910add': {
      'prov:startTime': '2019-11-01T18:50:35',
      'prov:endTime': '2019-11-01T18:50:35',
      'prov:type': 'Activity',
      'hubmap:created_by_user_sub': '83ae233d-6d1d-40eb-baa7-b6f636ab579a',
      'hubmap:uuid': 'b2d1ee0970654ba5a158b25526910add',
      'hubmap:created_by_user_email': 'allenj2@vanderbilt.edu',
      'hubmap:created_by_user_displayname': 'Jamie Allen',
      'hubmap:creation_action': 'Create Sample Activity',
      'hubmap:created_timestamp': '2019-11-01T18:50:35',
      'hubmap:hubmap_id': 'HBM665.NTZB.997',
    },
    'hubmap:activities/dc7103d824476585ac84494dfdbe8f42': {
      'prov:startTime': '2019-11-01T18:49:10',
      'prov:endTime': '2019-11-01T18:49:10',
      'prov:type': 'Activity',
      'hubmap:created_by_user_sub': '83ae233d-6d1d-40eb-baa7-b6f636ab579a',
      'hubmap:uuid': 'dc7103d824476585ac84494dfdbe8f42',
      'hubmap:created_by_user_email': 'allenj2@vanderbilt.edu',
      'hubmap:created_by_user_displayname': 'Jamie Allen',
      'hubmap:creation_action': 'Register Donor Activity',
      'hubmap:created_timestamp': '2019-11-01T18:49:10',
      'hubmap:hubmap_id': 'HBM398.NBBW.527',
    },
  },
  actedOnBehalfOf: {
    '_:id1': {
      'prov:delegate': 'hubmap:agent/30267a6e-35fe-40ef-8792-f311321868e9',
      'prov:responsible': 'hubmap:organization/73bb26e4-ed43-11e8-8f19-0a7c1eab007a',
      'prov:activity': 'hubmap:activities/b2d1ee0970654ba5a158b25526910add',
    },
    '_:id4': {
      'prov:delegate': 'hubmap:agent/30267a6e-35fe-40ef-8792-f311321868e9',
      'prov:responsible': 'hubmap:organization/73bb26e4-ed43-11e8-8f19-0a7c1eab007a',
      'prov:activity': 'hubmap:activities/dc7103d824476585ac84494dfdbe8f42',
    },
  },
  entity: {
    'hubmap:entities/13129ad371683171b152618c83fd9e6f': {
      'prov:type': 'Entity',
      'hubmap:data_access_level': 'public',
      'hubmap:organ': 'LK',
      'hubmap:created_by_user_sub': '30267a6e-35fe-40ef-8792-f311321868e9',
      'hubmap:uuid': '13129ad371683171b152618c83fd9e6f',
      'hubmap:created_by_user_email': 'neumane@vanderbilt.edu',
      'hubmap:created_by_user_displayname': 'Elizabeth Neumann',
      'hubmap:specimen_type': 'organ',
      'hubmap:entity_type': 'Sample',
      'hubmap:lab_tissue_sample_id': '65631',
      'hubmap:group_name': 'Vanderbilt TMC',
      'hubmap:last_modified_timestamp': '2019-11-01T18:50:35',
      'hubmap:protocol_url': 'https://dx.doi.org/10.17504/protocols.io.bfskjncw',
      'hubmap:created_timestamp': '2019-11-01T18:50:35',
      'hubmap:group_uuid': '73bb26e4-ed43-11e8-8f19-0a7c1eab007a',
      'hubmap:hubmap_id': 'HBM666.CHPF.373',
      'hubmap:submission_id': 'VAN0003-LK',
    },
    'hubmap:entities/c624abbe9836c7e3b6a8d8216a316f30': {
      'prov:type': 'Entity',
      'hubmap:label': 'Entity',
      'hubmap:data_access_level': 'public',
      'hubmap:created_by_user_sub': '30267a6e-35fe-40ef-8792-f311321868e9',
      'hubmap:description': 'Age 73, White Female',
      'hubmap:uuid': 'c624abbe9836c7e3b6a8d8216a316f30',
      'hubmap:created_by_user_email': 'neumane@vanderbilt.edu',
      'hubmap:lab_donor_id': '68-71',
      'hubmap:created_by_user_displayname': 'Elizabeth Neumann',
      'hubmap:entity_type': 'Donor',
      'hubmap:group_name': 'Vanderbilt TMC',
      'hubmap:last_modified_timestamp': '2019-11-01T18:50:35',
      'hubmap:protocol_url': 'dx.doi.org/10.17504/protocols.io.7hhhj36',
      'hubmap:created_timestamp': '2019-11-01T18:50:35',
      'hubmap:group_uuid': '73bb26e4-ed43-11e8-8f19-0a7c1eab007a',
      'hubmap:hubmap_id': 'HBM547.NCQL.874',
      'hubmap:submission_id': 'VAN0003',
    },
  },
  wasGeneratedBy: {
    '_:id2': {
      'prov:entity': 'hubmap:entities/13129ad371683171b152618c83fd9e6f',
      'prov:activity': 'hubmap:activities/b2d1ee0970654ba5a158b25526910add',
    },
    '_:id5': {
      'prov:entity': 'hubmap:entities/c624abbe9836c7e3b6a8d8216a316f30',
      'prov:activity': 'hubmap:activities/dc7103d824476585ac84494dfdbe8f42',
    },
  },
  used: {
    '_:id3': {
      'prov:activity': 'hubmap:activities/b2d1ee0970654ba5a158b25526910add',
      'prov:entity': 'hubmap:entities/c624abbe9836c7e3b6a8d8216a316f30',
    },
    '_:id6': {
      'prov:activity': 'hubmap:activities/dc7103d824476585ac84494dfdbe8f42',
      'prov:entity': 'hubmap:entities/73bb26e4-ed43-11e8-8f19-0a7c1eab007a',
    },
  },
};

test('should ', () => {
  const nodesText = [
    'hubmap:entities/73bb26e4-ed43-11e8-8f19-0a7c1eab007a',
    'Register Donor Activity - HBM398.NBBW.527',
    'Donor - HBM547.NCQL.874',
    'Create Sample Activity - HBM665.NTZB.997',
    'Sample - HBM666.CHPF.373',
  ];

  render(<ProvGraph provData={provData} />);

  nodesText.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());
});
