async function getPublicContent() {
  const response = await fetch(`${process.env.API_GATEWAY_URL}/public`);

  if (!response.ok) {
    throw new Error("We can not get public content");
  }
  return response.json();
}

async function getPosts(token) {
  const response = await fetch(`${process.env.API_GATEWAY_URL}/posts`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  console.log(response);

  if (!response.ok) {
    throw new Error("We can not get posts");
  }
  return response.json();
}

module.exports = {
  getPublicContent,
  getPosts,
};
