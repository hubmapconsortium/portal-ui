import { filter } from './utils';

export default {
  filters: [
    filter('created_by_user_displayname', 'Creator'),
    filter('group_name', 'Group'),
  ],
  fields: ['description', 'status', 'entity_type'],
};
