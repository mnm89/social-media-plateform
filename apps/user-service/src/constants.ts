export const attributes = [
  {
    name: 'username',
    displayName: '${username}',
    required: {
      roles: ['user'],
    },
    validations: {
      length: {
        min: 3,
        max: 255,
      },
      'username-prohibited-characters': {},
      'up-username-not-idn-homograph': {},
    },
    permissions: {
      view: ['admin', 'user'],
      edit: ['admin', 'user'],
    },
    multivalued: false,
  },
  {
    name: 'email',
    displayName: '${email}',
    validations: {
      email: {},
      length: {
        max: 255,
      },
    },
    required: {
      roles: ['user'],
    },
    permissions: {
      view: ['admin', 'user'],
      edit: ['admin', 'user'],
    },
    multivalued: false,
  },
  {
    name: 'firstName',
    displayName: '${firstName}',
    validations: {
      length: {
        max: 255,
      },
      'person-name-prohibited-characters': {},
    },
    permissions: {
      edit: ['admin', 'user'],
      view: ['admin', 'user'],
    },
    multivalued: false,
    annotations: {},
    group: null,
  },
  {
    name: 'lastName',
    displayName: '${lastName}',
    validations: {
      length: {
        max: 255,
      },
      'person-name-prohibited-characters': {},
    },
    permissions: {
      edit: ['admin', 'user'],
      view: ['admin', 'user'],
    },
    multivalued: false,
    annotations: {},
    group: null,
  },
  {
    name: 'phone',
    displayName: '${phone}',
    validations: {
      length: {
        max: 255,
      },
      'person-name-prohibited-characters': {},
    },
    permissions: {
      edit: ['admin', 'user'],
      view: ['admin', 'user'],
    },
    multivalued: false,
    annotations: {},
    group: null,
  },
  {
    name: 'address',
    displayName: '${address}',
    validations: {
      length: {
        max: 255,
      },
      'person-name-prohibited-characters': {},
    },
    permissions: {
      edit: ['admin', 'user'],
      view: ['admin', 'user'],
    },
    multivalued: false,
    annotations: {},
    group: null,
  },
  {
    name: 'bio',
    displayName: '${bio}',
    validations: {},
    permissions: {
      edit: ['admin', 'user'],
      view: ['admin', 'user'],
    },
    multivalued: false,
    annotations: {},
    group: null,
  },
];
export const groups = [
  {
    name: 'user-metadata',
    displayHeader: 'User metadata',
    displayDescription: 'Attributes, which refer to user metadata',
  },
];
export const defaultUsersIds = Array.from({ length: 8 }, (_, i) => i + 1).map(
  (x) =>
    `${x}${x}${x}${x}${x}${x}${x}${x}-${x}${x}${x}${x}-${x}${x}${x}${x}-${x}${x}${x}${x}-${x}${x}${x}${x}${x}${x}${x}${x}${x}${x}${x}${x}`
);
export const defaultPrivacy = [
  { attribute: 'phone', visibility: 'private' },
  { attribute: 'address', visibility: 'friends-only' },
  { attribute: 'bio', visibility: 'public' },
];
