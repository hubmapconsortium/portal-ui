const donorProv = {
  prefix: { hubmap: 'https://hubmapconsortium.org/' },
  agent: {
    'hubmap:agent/be70e17d-9bc1-4a91-a83f-6950bdd1287b': {
      'prov:type': { $: 'prov:Person', type: 'prov:QUALIFIED_NAME' },
      'hubmap:userDisplayName': 'Yiing Lin',
      'hubmap:userEmail': 'liny@wustl.edu',
      'hubmap:userUUID': 'be70e17d-9bc1-4a91-a83f-6950bdd1287b',
    },
    'hubmap:organization/308f5ffc-ed43-11e8-b56a-0e8017bdda58': {
      'prov:type': { $: 'prov:Organization', type: 'prov:QUALIFIED_NAME' },
      'hubmap:groupUUID': '308f5ffc-ed43-11e8-b56a-0e8017bdda58',
      'hubmap:groupName': 'California Institute of Technology TMC',
    },
  },
  activity: {
    'hubmap:activities/b128518978a43b31451a7e64df0334e6': {
      'prov:startTime': '2019-10-15T14:01:59',
      'prov:endTime': '2019-10-15T14:01:59',
      'prov:type': 'Activity',
      'hubmap:created_by_user_sub': 'be70e17d-9bc1-4a91-a83f-6950bdd1287b',
      'hubmap:uuid': 'b128518978a43b31451a7e64df0334e6',
      'hubmap:created_by_user_email': 'liny@wustl.edu',
      'hubmap:created_by_user_displayname': 'Yiing Lin',
      'hubmap:creation_action': 'Register Donor Activity',
      'hubmap:created_timestamp': '2019-10-15T14:01:59',
      'hubmap:hubmap_id': 'HBM826.XCGC.423',
    },
  },
  actedOnBehalfOf: {
    '_:id1': {
      'prov:delegate': 'hubmap:agent/be70e17d-9bc1-4a91-a83f-6950bdd1287b',
      'prov:responsible': 'hubmap:organization/308f5ffc-ed43-11e8-b56a-0e8017bdda58',
      'prov:activity': 'hubmap:activities/b128518978a43b31451a7e64df0334e6',
    },
  },
  entity: {
    'hubmap:entities/a3ab4491d04dff03fdd2cee5a2df70b3': {
      'prov:type': 'Entity',
      'hubmap:label': 'Entity',
      'hubmap:data_access_level': 'public',
      'hubmap:open_consent': 'False',
      'hubmap:created_by_user_sub': 'be70e17d-9bc1-4a91-a83f-6950bdd1287b',
      'hubmap:last_modified_user_email': 'nicogpt@caltech.edu',
      'hubmap:uuid': 'a3ab4491d04dff03fdd2cee5a2df70b3',
      'hubmap:created_by_user_email': 'liny@wustl.edu',
      'hubmap:lab_donor_id': 'W101/B002',
      'hubmap:last_modified_user_sub': '17d4e024-0696-4b18-a0fb-c5a4fa42ac48',
      'hubmap:created_by_user_displayname': 'Yiing Lin',
      'hubmap:entity_type': 'Donor',
      'hubmap:last_modified_user_displayname': 'Nico Pierson',
      'hubmap:group_name': 'California Institute of Technology TMC',
      'hubmap:last_modified_timestamp': '2019-10-15T14:01:59',
      'hubmap:protocol_url': 'dx.doi.org/10.17504/protocols.io.bin8kdhw',
      'hubmap:created_timestamp': '2019-10-15T14:01:59',
      'hubmap:group_uuid': '308f5ffc-ed43-11e8-b56a-0e8017bdda58',
      'hubmap:hubmap_id': 'HBM528.WJLC.564',
      'hubmap:submission_id': 'CALT0001',
    },
  },
  wasGeneratedBy: {
    '_:id2': {
      'prov:entity': 'hubmap:entities/a3ab4491d04dff03fdd2cee5a2df70b3',
      'prov:activity': 'hubmap:activities/b128518978a43b31451a7e64df0334e6',
    },
  },
  used: {
    '_:id3': {
      'prov:activity': 'hubmap:activities/b128518978a43b31451a7e64df0334e6',
      'prov:entity': 'hubmap:entities/308f5ffc-ed43-11e8-b56a-0e8017bdda58',
    },
  },
};

export default donorProv;
