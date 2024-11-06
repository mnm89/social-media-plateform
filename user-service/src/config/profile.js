const { getAccessToken } = require("../helpers/accessToken");

const attributes = [
  {
    name: "username",
    displayName: "${username}",
    required: {
      roles: ["user"],
    },
    validations: {
      length: {
        min: 3,
        max: 255,
      },
      "username-prohibited-characters": {},
      "up-username-not-idn-homograph": {},
    },
    permissions: {
      view: ["admin", "user"],
      edit: ["admin", "user"],
    },
    multivalued: false,
  },
  {
    name: "email",
    displayName: "${email}",
    validations: {
      email: {},
      length: {
        max: 255,
      },
    },
    required: {
      roles: ["user"],
    },
    permissions: {
      view: ["admin", "user"],
      edit: ["admin", "user"],
    },
    multivalued: false,
  },
  {
    name: "firstName",
    displayName: "${firstName}",
    validations: {
      length: {
        max: 255,
      },
      "person-name-prohibited-characters": {},
    },
    permissions: {
      edit: ["admin", "user"],
      view: ["admin", "user"],
    },
    multivalued: false,
    annotations: {},
    group: null,
  },
  {
    name: "lastName",
    displayName: "${lastName}",
    validations: {
      length: {
        max: 255,
      },
      "person-name-prohibited-characters": {},
    },
    permissions: {
      edit: ["admin", "user"],
      view: ["admin", "user"],
    },
    multivalued: false,
    annotations: {},
    group: null,
  },
];
const groups = [
  {
    name: "user-metadata",
    displayHeader: "User metadata",
    displayDescription: "Attributes, which refer to user metadata",
  },
];
async function bootstrapUsersProfile() {
  const token = await getAccessToken();

  try {
    const response = await fetch(
      `${process.env.KEYCLOAK_SERVER_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users/profile`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${token}`,
        },
        body: JSON.stringify({
          attributes,
          groups,
        }),
      }
    );
    if (!response.ok) {
      console.error("Failed to bootstrap users profile:", response.statusText);
    }
  } catch (error) {
    console.error("Failed to bootstrap users profile:", error);
  }
}
module.exports = { bootstrapUsersProfile, attributes };
