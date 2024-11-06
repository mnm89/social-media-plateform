async function handleNonOkResponse(response) {
  const error = new Error();
  error.name = response.statusText;
  const isJson = response.headers.get("content-type") === "application/json";
  error.message = isJson
    ? (await response.json()).message
    : await response.text();
  return error;
}
async function getPublicContent() {
  const response = await fetch(`${process.env.API_GATEWAY_URL}/public`);

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

module.exports = {
  getPublicContent,
  getPosts,
  getPost,
};
