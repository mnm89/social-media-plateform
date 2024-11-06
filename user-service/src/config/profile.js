const { getAccessToken } = require("../helpers/accessToken");

const attributes = [
  {
    name: "email",
    required: {
      roles: ["user"],
    },
    permissions: {
      view: ["user"],
      edit: ["user"],
    },
    validations: {
      email: {},
      length: {
        max: 255,
      },
    },
  },
  {
    name: "username",
    permissions: {
      view: ["user"],
      edit: ["user"],
    },
    validations: {
      length: {
        min: 3,
        max: 255,
      },
      "username-prohibited-characters": {},
      "up-username-not-idn-homograph": {},
    },
  },
];
const groups = [];
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
