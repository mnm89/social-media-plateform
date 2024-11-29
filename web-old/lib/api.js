async function handleNonOkResponse(response) {
  const error = new Error();
  error.name = response.statusText;
  try {
    error.message = (await response.json()).message;
  } catch (e) {
    error.message = await response.text();
  }
  return error;
}
async function getPublicPosts() {
  const response = await fetch(`${process.env.API_GATEWAY_URL}/public-posts`);

  if (response.ok) return response.json();
  throw await handleNonOkResponse(response);
}

async function getPosts(token) {
  const response = await fetch(`${process.env.API_GATEWAY_URL}/posts`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  if (response.ok) return response.json();
  throw await handleNonOkResponse(response);
}
async function getPost(token, id) {
  const response = await fetch(`${process.env.API_GATEWAY_URL}/posts/${id}`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  if (response.ok) return response.json();
  throw await handleNonOkResponse(response);
}

async function getFriends(token) {
  const response = await fetch(`${process.env.API_GATEWAY_URL}/friendships`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  if (response.ok) return response.json();
  throw await handleNonOkResponse(response);
}

async function getPublicProfile(token, userId) {
  const response = await fetch(
    `${process.env.API_GATEWAY_URL}/public-profiles/${userId}`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  if (response.ok) return response.json();
  throw await handleNonOkResponse(response);
}
async function getCurrentProfile(token) {
  const response = await fetch(`${process.env.API_GATEWAY_URL}/profiles`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  if (response.ok) return response.json();
  throw await handleNonOkResponse(response);
}

module.exports = {
  getPublicPosts,
  getPosts,
  getPost,
  handleNonOkResponse,
  getFriends,
  getPublicProfile,
  getCurrentProfile,
};
